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

#[Route('/api')]
class AuthController extends AbstractController
{
    private EntityManagerInterface $em;
    private UserRepository $userRepository;
    private UserPasswordHasherInterface $passwordHasher;

    public function __construct(
        EntityManagerInterface $em,
        UserRepository $userRepository,
        UserPasswordHasherInterface $passwordHasher
    ) {
        $this->em = $em;
        $this->userRepository = $userRepository;
        $this->passwordHasher = $passwordHasher;
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

        return $this->json($user->toArray(), Response::HTTP_CREATED);
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

        // Session will automatically store user since stateless: false
        return $this->json($user->toArray());
    }

    // ----------------- CURRENT USER -----------------
    #[Route('/me', name: 'api_me', methods: ['GET'])]
    public function me(#[CurrentUser] ?User $user): JsonResponse
    {
        if (!$user) {
            return $this->json(null, Response::HTTP_UNAUTHORIZED);
        }

        return $this->json($user->toArray());
    }
}
