<?php

namespace App\Controller\Api;

use App\Entity\User;
use App\Repository\UserRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\Security\Http\Attribute\CurrentUser;
use Symfony\Component\Mailer\MailerInterface;
use Symfony\Component\Mime\Email;

#[Route('/api')]
class AuthController extends AbstractController
{
    private EntityManagerInterface $em;
    private UserRepository $userRepository;
    private UserPasswordHasherInterface $passwordHasher;
    private ?MailerInterface $mailer;

    public function __construct(
        EntityManagerInterface $em,
        UserRepository $userRepository,
        UserPasswordHasherInterface $passwordHasher,
        ?MailerInterface $mailer = null
    ) {
        $this->em = $em;
        $this->userRepository = $userRepository;
        $this->passwordHasher = $passwordHasher;
        $this->mailer = $mailer;
    }

    // ----------------- REGISTER -----------------
    #[Route('/register', name: 'api_register', methods: ['POST'])]
    public function register(Request $request): JsonResponse
    {
        $data = json_decode($request->getContent(), true);
        $name = $data['name'] ?? null;
        $email = $data['email'] ?? null;
        $password = $data['password'] ?? null;

        if (!$name || !$email || !$password) {
            return $this->json(['error' => 'All fields are required'], Response::HTTP_BAD_REQUEST);
        }

        if ($this->userRepository->findOneBy(['email' => $email])) {
            return $this->json(['error' => 'Email already exists'], Response::HTTP_CONFLICT);
        }

        $user = new User();
        $user->setName($name)
             ->setEmail($email)
             ->setRoles(['ROLE_USER'])
             ->setPassword($this->passwordHasher->hashPassword($user, $password));

        $this->em->persist($user);
        $this->em->flush();

        // Optional: send welcome email if Mailer is configured
        if ($this->mailer) {
            try {
                $emailMessage = (new Email())
                    ->from('noreply@realestatepro.local')
                    ->to($email)
                    ->subject('Welcome to RealEstatePro!')
                    ->html("
                        <h2>Welcome, {$name}!</h2>
                        <p>Your account has been successfully created on <strong>RealEstatePro</strong>.</p>
                        <p>You can now log in and start exploring properties.</p>
                        <br>
                        <p>Best regards,<br><strong>The RealEstatePro Team</strong></p>
                    ");
                $this->mailer->send($emailMessage);
            } catch (\Exception $e) {
                // Log email errors
            }
        }

        return $this->json([
            'id' => $user->getId(),
            'email' => $user->getEmail(),
            'name' => $user->getName(),
            'roles' => $user->getRoles(),
            'savedProperties' => [],
            'searchPreferences' => [],
            'message' => 'User registered successfully.'
        ], Response::HTTP_CREATED);
    }

    // ----------------- LOGIN -----------------
    #[Route('/login', name: 'api_login', methods: ['POST'])]
    public function login(Request $request, UserRepository $userRepo): JsonResponse
    {
        $data = json_decode($request->getContent(), true);
        $email = $data['email'] ?? null;
        $password = $data['password'] ?? null;

        if (!$email || !$password) {
            return $this->json(['error' => 'Email and password are required'], Response::HTTP_BAD_REQUEST);
        }

        $user = $userRepo->findOneBy(['email' => $email]);
        if (!$user || !$this->passwordHasher->isPasswordValid($user, $password)) {
            return $this->json(['error' => 'Invalid credentials'], Response::HTTP_UNAUTHORIZED);
        }

        // Optionally, handle session or JWT
        // For simplicity, frontend can use cookies/session
        return $this->json([
            'id' => $user->getId(),
            'email' => $user->getEmail(),
            'name' => $user->getName(),
            'roles' => $user->getRoles(),
            'savedProperties' => [],
            'searchPreferences' => []
        ]);
    }

    // ----------------- LOGOUT -----------------
    #[Route('/logout', name: 'api_logout', methods: ['POST'])]
    public function logout(): JsonResponse
    {
        // Symfony logout handled by firewall, this is just a placeholder
        return $this->json(['message' => 'Logged out successfully.']);
    }

    // ----------------- CURRENT USER -----------------
    #[Route('/me', name: 'api_me', methods: ['GET'])]
    public function me(#[CurrentUser] ?User $user): JsonResponse
    {
        if (!$user) {
            return $this->json(null, Response::HTTP_UNAUTHORIZED);
        }

        return $this->json([
            'id' => $user->getId(),
            'email' => $user->getEmail(),
            'name' => $user->getName(),
            'roles' => $user->getRoles(),
            'savedProperties' => [],
            'searchPreferences' => []
        ]);
    }
}
