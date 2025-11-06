<?php
namespace App\Controller\Api;

use App\Entity\User;
use App\Repository\UserRepository;
use Symfony\Component\Mailer\MailerInterface;
use Symfony\Component\Mime\Email;
use Symfony\Component\Uid\Uuid;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bridge\Doctrine\Types\UuidType;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

#[Route('/api/users')]
class UserController extends AbstractController
{
    public function __construct(
        private EntityManagerInterface $em, 
        private UserRepository $repo,
        private UserPasswordHasherInterface $passwordHasher
    ) {}

    // List all users
    #[Route('', methods: ['GET'])]
    public function index(): JsonResponse {
        $users = $this->repo->findAll();
        return $this->json($users);
    }

    // Get a single user
    #[Route('/{id}', methods: ['GET'])]
    public function show(User $user): JsonResponse {
        return $this->json($user);
    }

    // Create a new user
   #[Route('', methods: ['POST'])]
public function create(Request $request, MailerInterface $mailer): JsonResponse
{
    try {
        $data = json_decode($request->getContent(), true);

        $user = new User();
        $user->setName($data['name'] ?? '');
        $user->setEmail($data['email'] ?? '');
        $user->setRoles(['ROLE_USER']);
        $user->setSearchPreferences($data['searchPreferences'] ?? []);

        if (!empty($data['password'])) {
            $user->setPassword($this->passwordHasher->hashPassword($user, $data['password']));
        }

        // Generate confirmation token
        $confirmationToken = Uuid::v4()->toRfc4122();
        $user->setConfirmationToken($confirmationToken);

        $this->em->persist($user);
        $this->em->flush();

        // Send confirmation email
        $confirmationLink = sprintf('http://localhost:4200/confirm/%s', $confirmationToken);

        $email = (new Email())
            ->from('no-reply@realestatepro.com')
            ->to($user->getEmail())
            ->subject('Confirm your account')
            ->html("<p>Hi {$user->getName()},</p>
                    <p>Thank you for registering! Please confirm your email by clicking the link below:</p>
                    <p><a href='{$confirmationLink}'>Confirm Account</a></p>");

        try {
            $mailer->send($email);
        } catch (\Exception $e) {
            // If email fails, still allow user creation
            return $this->json([
                'status' => 'User created, but failed to send confirmation email.',
                'error' => $e->getMessage()
            ], 201);
        }

        return $this->json([
            'status' => 'User created. Please check your email to confirm your account.'
        ], 201);

    } catch (\Exception $e) {
        return $this->json([
            'error' => 'Registration failed.',
            'details' => $e->getMessage()
        ], 500);
    }
}


    #[Route('/confirm/{token}', methods: ['GET'])]
    public function confirmEmail(string $token): JsonResponse
    {
        $user = $this->repo->findOneBy(['confirmationToken' => $token]);

        if (!$user) {
            return $this->json(['error' => 'Invalid token'], 400);
        }

        // Make sure Doctrine tracks changes
        $user->setIsConfirmed(true);
        $user->setConfirmationToken(null);
        $this->em->persist($user); // <- important!
        $this->em->flush();

        return $this->json(['status' => 'Email confirmed! You can now log in.']);
    }
    // Update an existing user
    #[Route('/{id}', methods: ['PUT'])]
    public function update(Request $request, User $user): JsonResponse {
        $data = json_decode($request->getContent(), true);

        $user->setName($data['name'] ?? $user->getName());
        $user->setEmail($data['email'] ?? $user->getEmail());

        // Update password if provided
        if (!empty($data['password'])) {
            $user->setPassword($this->passwordHasher->hashPassword($user, $data['password']));
        }

        $user->setRoles($data['roles'] ?? $user->getRoles());
        $user->setSearchPreferences($data['searchPreferences'] ?? $user->getSearchPreferences());

        $this->em->flush();

        return $this->json($user, 200);
    }

    // Delete a user
    #[Route('/{id}', methods: ['DELETE'])]
    public function delete(User $user): JsonResponse {
        $this->em->remove($user);
        $this->em->flush();

        return $this->json(['status' => 'deleted'], 200);
    }

    #[Route('/login', methods: ['POST'])]
    public function login(Request $request): JsonResponse
    {
        $data = json_decode($request->getContent(), true);
        $email = $data['email'] ?? '';
        $password = $data['password'] ?? '';

        $user = $this->repo->findOneBy(['email' => $email]);
        if (!$user) {
            return $this->json(['error' => 'Invalid credentials'], 401);
        }

        if (!$this->passwordHasher->isPasswordValid($user, $password)) {
            return $this->json(['error' => 'Invalid credentials'], 401);
        }

        if (!$user->isConfirmed()) {
            return $this->json(['error' => 'Please confirm your email before logging in.'], 403);
        }

        return $this->json([
        'id' => $user->getId(),
        'name' => $user->getName(),
        'email' => $user->getEmail(),
        'roles' => $user->getRoles(),
        'isConfirmed' => $user->isConfirmed(),
    ]);
}
}
