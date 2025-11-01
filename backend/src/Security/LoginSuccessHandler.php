<?php
namespace App\Security;

use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Security\Http\Authentication\AuthenticationSuccessHandlerInterface;
use Symfony\Component\Security\Core\Authentication\Token\TokenInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Security\Core\User\UserInterface;

class LoginSuccessHandler implements AuthenticationSuccessHandlerInterface
{
    public function onAuthenticationSuccess(Request $request, TokenInterface $token): JsonResponse
    {
        /** @var UserInterface $user */
        $user = $token->getUser();

        return new JsonResponse([
            'id' => $user->getId(),
            'email' => $user->getUserIdentifier(),
            'name' => method_exists($user, 'getName') ? $user->getName() : null,
            'roles' => $user->getRoles()
        ]);
    }
}
