<?php

namespace App\Controller\Api;

use App\Entity\Property;
use App\Service\UploadService;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\String\Slugger\SluggerInterface;
use Symfony\Component\Validator\Validator\ValidatorInterface;

#[Route('/api/properties')]
class PropertyController extends AbstractController
{
    private UploadService $uploadService;

    public function __construct(UploadService $uploadService)
    {
        $this->uploadService = $uploadService;
    }

    // -----------------------------
    // 🔹 Helper method for consistent JSON responses
    // -----------------------------
    private function jsonPropertyResponse(mixed $data, int $status = 200): JsonResponse
    {
        return $this->json($data, $status, [], ['groups' => ['property:read']]);
    }

    // -----------------------------
    // 🔹 List all properties
    // -----------------------------
    #[Route('', methods: ['GET'])]
    public function list(EntityManagerInterface $em): JsonResponse
    {
        $properties = $em->getRepository(Property::class)->findAll();
        return $this->jsonPropertyResponse($properties);
    }

    // -----------------------------
    // 🔹 Get property by ID
    // -----------------------------
    #[Route('/{id}', methods: ['GET'])]
    public function show(EntityManagerInterface $em, int $id): JsonResponse
    {
        $property = $em->getRepository(Property::class)->find($id);
        if (!$property) {
            return new JsonResponse(['message' => 'Property not found'], 404);
        }
        return $this->jsonPropertyResponse($property);
    }

    // -----------------------------
    // 🔹 Create new property
    // -----------------------------
   #[Route('', methods: ['POST'])]
public function create(
    Request $request,
    EntityManagerInterface $em,
    SluggerInterface $slugger,
    ValidatorInterface $validator
): JsonResponse {
    $property = new Property();

    // -----------------------------
    // 1️⃣ Get normal fields from FormData
    // -----------------------------
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

    // -----------------------------
    // 2️⃣ Handle multiple file uploads
    // -----------------------------
    $images = [];
    /** @var \Symfony\Component\HttpFoundation\File\UploadedFile[] $files */
    $files = $request->files->get('images') ?? [];
    foreach ($files as $file) {
        $originalFilename = pathinfo($file->getClientOriginalName(), PATHINFO_FILENAME);
        $safeFilename = $slugger->slug($originalFilename);
        $newFilename = $safeFilename . '-' . uniqid() . '.' . $file->guessExtension();

        try {
            $file->move($this->getParameter('uploads_directory'), $newFilename);
            $images[] = '/uploads/' . $newFilename;
        } catch (\Exception $e) {
            return $this->json([
                'message' => 'Failed to upload file: ' . $file->getClientOriginalName()
            ], 500);
        }
    }
    $property->setImages($images);

    // -----------------------------
    // 3️⃣ Validate entity
    // -----------------------------
    $errors = $validator->validate($property);
    if (count($errors) > 0) {
        $validationErrors = [];
        foreach ($errors as $error) {
            $validationErrors[$error->getPropertyPath()] = $error->getMessage();
        }

        return $this->json([
            'message' => 'Validation failed',
            'errors' => $validationErrors
        ], 400);
    }

    // -----------------------------
    // 4️⃣ Save to database
    // -----------------------------
    $em->persist($property);
    $em->flush();

    return $this->json($property, 201, [], ['groups' => ['property:read']]);
}

    // -----------------------------
    // 🔹 Update property (PUT)
    // -----------------------------
    #[Route('/{id}', methods: ['PUT'])]
    public function update(
        Request $request,
        EntityManagerInterface $em,
        ValidatorInterface $validator,
        int $id
    ): JsonResponse {
        $property = $em->getRepository(Property::class)->find($id);
        if (!$property) {
            return new JsonResponse(['message' => 'Property not found'], 404);
        }

        $data = json_decode($request->getContent(), true);
        if (!is_array($data)) {
            return new JsonResponse(['message' => 'Invalid JSON body'], 400);
        }

        // Update fields
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

        // Validate
        $errors = $validator->validate($property);
        if (count($errors) > 0) {
            return $this->json($errors, 400);
        }

        $em->flush();
        return $this->jsonPropertyResponse($property);
    }

    // -----------------------------
    // 🔹 Delete property
    // -----------------------------
    #[Route('/{id}', methods: ['DELETE'])]
    public function delete(EntityManagerInterface $em, int $id): JsonResponse
    {
        $property = $em->getRepository(Property::class)->find($id);
        if (!$property) {
            return new JsonResponse(['message' => 'Property not found'], 404);
        }

        $em->remove($property);
        $em->flush();

        return new JsonResponse(['message' => 'Property deleted']);
    }

    // -----------------------------
    // 🔹 Search route (for Angular filters)
    // -----------------------------
    #[Route('/search', methods: ['GET'])]
    public function search(Request $request, EntityManagerInterface $em): JsonResponse
    {
        $repo = $em->getRepository(Property::class);
        $qb = $repo->createQueryBuilder('p');

        if ($type = $request->query->get('type')) {
            $qb->andWhere('p.type = :type')->setParameter('type', $type);
        }
        if ($minPrice = $request->query->get('minPrice')) {
            $qb->andWhere('p.price >= :minPrice')->setParameter('minPrice', (float)$minPrice);
        }
        if ($maxPrice = $request->query->get('maxPrice')) {
            $qb->andWhere('p.price <= :maxPrice')->setParameter('maxPrice', (float)$maxPrice);
        }
        if ($location = $request->query->get('location')) {
            $qb->andWhere('LOWER(p.location) LIKE LOWER(:location)')
               ->setParameter('location', '%' . $location . '%');
        }
        if ($propertyType = $request->query->get('propertyType')) {
            $qb->andWhere('p.propertyType = :propertyType')
               ->setParameter('propertyType', $propertyType);
        }
        if ($minBedrooms = $request->query->get('minBedrooms')) {
            $qb->andWhere('p.bedrooms >= :minBedrooms')->setParameter('minBedrooms', (int)$minBedrooms);
        }

        $properties = $qb->getQuery()->getResult();
        return $this->jsonPropertyResponse($properties);
    }

    // -----------------------------
    // 🔹 Save/Unsave property for user
    // -----------------------------
    #[Route('/{id}/save', methods: ['POST'])]
    public function save(EntityManagerInterface $em, int $id): JsonResponse
    {
        $user = $this->getUser();
        if (!$user) {
            return new JsonResponse(['message' => 'Unauthorized'], 401);
        }

        $property = $em->getRepository(Property::class)->find($id);
        if (!$property) {
            return new JsonResponse(['message' => 'Property not found'], 404);
        }

        $user->addSavedProperty($property);
        $em->flush();

        return new JsonResponse(['message' => 'Property saved']);
    }

    #[Route('/{id}/unsave', methods: ['POST'])]
    public function unsave(EntityManagerInterface $em, int $id): JsonResponse
    {
        $user = $this->getUser();
        if (!$user) {
            return new JsonResponse(['message' => 'Unauthorized'], 401);
        }

        $property = $em->getRepository(Property::class)->find($id);
        if (!$property) {
            return new JsonResponse(['message' => 'Property not found'], 404);
        }

        $user->removeSavedProperty($property);
        $em->flush();

        return new JsonResponse(['message' => 'Property unsaved']);
    }
}
