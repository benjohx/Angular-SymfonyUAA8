<?php

namespace App\Controller\Api;

use App\Entity\Property;
use App\Repository\PropertyRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Security\Http\Attribute\IsGranted;

#[Route('/api/properties')]
class PropertyController extends AbstractController
{
    public function __construct(
        private EntityManagerInterface $em,
        private PropertyRepository $repo
    ) {}

    // ---------------- Public Endpoints ----------------

    #[Route('', methods: ['GET'])]
    public function index(): JsonResponse
    {
        $properties = $this->repo->findAll();
        return $this->json(
            $properties,
            200,
            [],
            ['groups' => 'property:read']
        );
    }

    #[Route('/{id}', methods: ['GET'])]
    public function show(Property $property): JsonResponse
    {
        return $this->json(
            $property,
            200,
            [],
            ['groups' => 'property:read']
        );
    }

    // ---------------- Admin Protected Endpoints ----------------

    #[Route('', methods: ['POST'])]
    #[IsGranted('ROLE_ADMIN')]
    public function create(Request $request): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        $property = new Property();
        $property->setTitle($data['title'] ?? '');
        $property->setDescription($data['description'] ?? null);
        $property->setLocation($data['location'] ?? null);
        $property->setPrice(isset($data['price']) ? (float)$data['price'] : null);
        $property->setType($data['type'] ?? null);
        $property->setPropertyType($data['propertyType'] ?? null);
        $property->setBedrooms(isset($data['bedrooms']) ? (int)$data['bedrooms'] : null);
        $property->setBathrooms(isset($data['bathrooms']) ? (int)$data['bathrooms'] : null);
        $property->setArea(isset($data['area']) ? (float)$data['area'] : null);
        $property->setImages($data['images'] ?? []);
        $property->setContactEmail($data['contactEmail'] ?? null);
        $property->setContactPhone($data['contactPhone'] ?? null);
        $property->setCreatedAt(new \DateTime());

        $this->em->persist($property);
        $this->em->flush();

        return $this->json(
            $property,
            201,
            [],
            ['groups' => 'property:read']
        );
    }

    #[Route('/{id}', methods: ['PUT'])]
    #[IsGranted('ROLE_ADMIN')]
    public function update(Request $request, Property $property): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        $property->setTitle($data['title'] ?? $property->getTitle());
        $property->setDescription($data['description'] ?? $property->getDescription());
        $property->setLocation($data['location'] ?? $property->getLocation());
        $property->setPrice(isset($data['price']) ? (float)$data['price'] : $property->getPrice());
        $property->setType($data['type'] ?? $property->getType());
        $property->setPropertyType($data['propertyType'] ?? $property->getPropertyType());
        $property->setBedrooms(isset($data['bedrooms']) ? (int)$data['bedrooms'] : $property->getBedrooms());
        $property->setBathrooms(isset($data['bathrooms']) ? (int)$data['bathrooms'] : $property->getBathrooms());
        $property->setArea(isset($data['area']) ? (float)$data['area'] : $property->getArea());
        $property->setImages($data['images'] ?? $property->getImages());
        $property->setContactEmail($data['contactEmail'] ?? $property->getContactEmail());
        $property->setContactPhone($data['contactPhone'] ?? $property->getContactPhone());

        $this->em->flush();

        return $this->json(
            $property,
            200,
            [],
            ['groups' => 'property:read']
        );
    }

    #[Route('/{id}', methods: ['DELETE'])]
    #[IsGranted('ROLE_ADMIN')]
    public function delete(Property $property): JsonResponse
    {
        $this->em->remove($property);
        $this->em->flush();

        return $this->json(['status' => 'deleted'], 200);
    }
}
