<?php

namespace App\Controller\Api;

use App\Entity\Property;
use App\Service\UploadService;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\String\Slugger\SluggerInterface;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;

#[Route('/api/properties')]
class PropertyController extends AbstractController
{
    private UploadService $uploadService;

    public function __construct(UploadService $uploadService)
    {
        $this->uploadService = $uploadService;
    }

    #[Route('', methods: ['GET'])]
    public function list(EntityManagerInterface $em): JsonResponse
    {
        $properties = $em->getRepository(Property::class)->findAll();
        return $this->json($properties, 200, [], ['groups' => ['property']]);
    }

    #[Route('/{id}', methods: ['GET'])]
    public function show(EntityManagerInterface $em, int $id): JsonResponse
    {
        $property = $em->getRepository(Property::class)->find($id);
        if (!$property) return new JsonResponse(['message' => 'Property not found'], 404);
        return $this->json($property, 200, [], ['groups' => ['property']]);
    }

    #[Route('', methods: ['POST'])]
    public function create(Request $request, EntityManagerInterface $em, SluggerInterface $slugger): JsonResponse
    {
        $property = new Property();

        $property->setTitle($request->request->get('title', 'Untitled'));
        $property->setDescription($request->request->get('description', ''));
        $property->setPrice((float)$request->request->get('price', 0));
        $property->setType($request->request->get('type', 'sale'));
        $property->setPropertyType($request->request->get('propertyType', 'apartment'));
        $property->setLocation($request->request->get('location', ''));
        $property->setArea((float)$request->request->get('area', 0));
        $property->setBedrooms((int)$request->request->get('bedrooms', 0));
        $property->setBathrooms((int)$request->request->get('bathrooms', 0));
        $property->setContactEmail($request->request->get('contactEmail', ''));
        $property->setContactPhone($request->request->get('contactPhone', ''));

        $images = [];
        foreach ($request->files->get('images', []) as $file) {
            $originalFilename = pathinfo($file->getClientOriginalName(), PATHINFO_FILENAME);
            $safeFilename = $slugger->slug($originalFilename);
            $newFilename = $safeFilename . '-' . uniqid() . '.' . $file->guessExtension();
            $file->move($this->getParameter('uploads_directory'), $newFilename);
            $images[] = '/uploads/' . $newFilename;
        }
        $property->setImages($images);

        $em->persist($property);
        $em->flush();

        return $this->json($property, 201, [], ['groups' => ['property']]);
    }

    #[Route('/{id}', methods: ['PUT'])]
    public function update(Request $request, EntityManagerInterface $em, int $id): JsonResponse
    {
        $property = $em->getRepository(Property::class)->find($id);
        if (!$property) return new JsonResponse(['message' => 'Property not found'], 404);

        $data = json_decode($request->getContent(), true);

        $property->setTitle($data['title'] ?? $property->getTitle());
        $property->setDescription($data['description'] ?? $property->getDescription());
        $property->setPrice($data['price'] ?? $property->getPrice());
        $property->setType($data['type'] ?? $property->getType());
        $property->setPropertyType($data['propertyType'] ?? $property->getPropertyType());
        $property->setLocation($data['location'] ?? $property->getLocation());
        $property->setArea($data['area'] ?? $property->getArea());
        $property->setBedrooms($data['bedrooms'] ?? $property->getBedrooms());
        $property->setBathrooms($data['bathrooms'] ?? $property->getBathrooms());
        $property->setImages($data['images'] ?? $property->getImages());
        $property->setContactEmail($data['contactEmail'] ?? $property->getContactEmail());
        $property->setContactPhone($data['contactPhone'] ?? $property->getContactPhone());

        $em->flush();
        return $this->json($property, 200, [], ['groups' => ['property']]);
    }

    #[Route('/{id}', methods: ['DELETE'])]
    public function delete(EntityManagerInterface $em, int $id): JsonResponse
    {
        $property = $em->getRepository(Property::class)->find($id);
        if (!$property) return new JsonResponse(['message' => 'Property not found'], 404);

        $em->remove($property);
        $em->flush();
        return new JsonResponse(['message' => 'Property deleted']);
    }

    #[Route('/{id}/save', methods: ['POST'])]
    public function save(EntityManagerInterface $em, int $id): JsonResponse
    {
        $user = $this->getUser();
        if (!$user) return new JsonResponse(['message' => 'Unauthorized'], 401);

        $property = $em->getRepository(Property::class)->find($id);
        if (!$property) return new JsonResponse(['message' => 'Property not found'], 404);

        $user->addSavedProperty($property);
        $em->flush();

        return new JsonResponse(['message' => 'Property saved']);
    }

    #[Route('/{id}/unsave', methods: ['POST'])]
    public function unsave(EntityManagerInterface $em, int $id): JsonResponse
    {
        $user = $this->getUser();
        if (!$user) return new JsonResponse(['message' => 'Unauthorized'], 401);

        $property = $em->getRepository(Property::class)->find($id);
        if (!$property) return new JsonResponse(['message' => 'Property not found'], 404);

        $user->removeSavedProperty($property);
        $em->flush();

        return new JsonResponse(['message' => 'Property unsaved']);
    }
}
