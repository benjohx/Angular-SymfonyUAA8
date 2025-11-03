<?php

namespace App\Controller\Api;

use App\Entity\User;
use App\Entity\Property;
use Doctrine\ORM\EntityManagerInterface;
use App\Repository\UserRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

#[Route('/api/user')]
class UserController extends AbstractController
{
   // 🧩 List all users (admin-only)
    #[Route('/s', name: 'api_users_list', methods: ['GET'])] // 👈 slash added
    public function listUsers(UserRepository $userRepository): JsonResponse
    {
        $this->denyAccessUnlessGranted('ROLE_ADMIN');

        $users = $userRepository->findAll();

        $data = array_map(fn(User $u) => [
            'id' => $u->getId(),
            'email' => $u->getUserIdentifier(),
            'name' => $u->getName(),
            'roles' => $u->getRoles(),
        ], $users);

        return new JsonResponse($data);
    }

    #[Route('/{id}/promote', name: 'api_user_promote', methods: ['PUT'])]
    public function promote(int $id, UserRepository $userRepository, EntityManagerInterface $em): JsonResponse
    {
        $this->denyAccessUnlessGranted('ROLE_ADMIN');

        $user = $userRepository->find($id);
        if (!$user) {
            return new JsonResponse(['message' => 'User not found'], 404);
        }

        $roles = $user->getRoles();
        if (!in_array('ROLE_ADMIN', $roles)) {
            $roles[] = 'ROLE_ADMIN';
            $user->setRoles($roles);
            $em->flush();
        }

        return new JsonResponse(['message' => 'User promoted successfully']);
    }

    #[Route('/{id}', name: 'api_user_delete', methods: ['DELETE'])]
    public function delete(int $id, UserRepository $userRepository, EntityManagerInterface $em): JsonResponse
    {
        $this->denyAccessUnlessGranted('ROLE_ADMIN');

        $user = $userRepository->find($id);
        if (!$user) {
            return new JsonResponse(['message' => 'User not found'], 404);
        }

        $em->remove($user);
        $em->flush();

        return new JsonResponse(['message' => 'User deleted successfully']);
    }

    // ✅ FIXED: was "/api/me", now "/me"
    #[Route('/me', name: 'api_me', methods: ['GET'])]
    public function me(): JsonResponse
    {
        $user = $this->getUser();
        if (!$user) {
            return new JsonResponse(null, 401);
        }

        return new JsonResponse([
            'id' => $user->getId(),
            'email' => $user->getUserIdentifier(),
            'name' => $user->getName(),
            'roles' => $user->getRoles()
        ]);
    }
    // ----------------- Get current user -----------------
    #[Route('', methods: ['GET'])]
    public function current(): JsonResponse
    {
        $user = $this->getUser();
        if (!$user) return new JsonResponse(['message' => 'Unauthorized'], 401);

        return $this->json($user, 200, [], ['groups' => ['user']]);
    }

    // ----------------- Update user info -----------------
    #[Route('/update', methods: ['PUT'])]
    public function update(Request $request, EntityManagerInterface $em): JsonResponse
    {
        $user = $this->getUser();
        if (!$user) return new JsonResponse(['message' => 'Unauthorized'], 401);

        $data = json_decode($request->getContent(), true);

        if (isset($data['name'])) $user->setName($data['name']);
        if (isset($data['searchPreferences'])) $user->setSearchPreferences($data['searchPreferences']);

        $em->flush();

        return $this->json($user, 200, [], ['groups' => ['user']]);
    }

    // ----------------- Change password -----------------
    #[Route('/password', methods: ['PUT'])]
    public function changePassword(Request $request, EntityManagerInterface $em, UserPasswordHasherInterface $hasher): JsonResponse
    {
        $user = $this->getUser();
        if (!$user) return new JsonResponse(['message' => 'Unauthorized'], 401);

        $data = json_decode($request->getContent(), true);

        if (!isset($data['newPassword'])) {
            return new JsonResponse(['message' => 'New password required'], 400);
        }

        $user->setPassword($hasher->hashPassword($user, $data['newPassword']));
        $em->flush();

        return new JsonResponse(['message' => 'Password updated successfully']);
    }

    // ----------------- Save a property -----------------
    #[Route('/save-property/{id}', methods: ['POST'])]
    public function saveProperty(EntityManagerInterface $em, int $id): JsonResponse
    {
        $user = $this->getUser();
        if (!$user) return new JsonResponse(['message' => 'Unauthorized'], 401);

        $property = $em->getRepository(Property::class)->find($id);
        if (!$property) return new JsonResponse(['message' => 'Property not found'], 404);

        $user->addSavedProperty($property);
        $em->flush();

        return new JsonResponse(['message' => 'Property saved successfully']);
    }

    // ----------------- Unsave a property -----------------
    #[Route('/unsave-property/{id}', methods: ['POST'])]
    public function unsaveProperty(EntityManagerInterface $em, int $id): JsonResponse
    {
        $user = $this->getUser();
        if (!$user) return new JsonResponse(['message' => 'Unauthorized'], 401);

        $property = $em->getRepository(Property::class)->find($id);
        if (!$property) return new JsonResponse(['message' => 'Property not found'], 404);

        $user->removeSavedProperty($property);
        $em->flush();

        return new JsonResponse(['message' => 'Property removed from saved list']);
    }
    
}
