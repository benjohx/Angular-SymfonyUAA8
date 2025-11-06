<?php

namespace App\Entity;

use App\Repository\PropertyRepository;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;

#[ORM\Entity(repositoryClass: PropertyRepository::class)]
class Property
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['property:read'])]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    #[Groups(['property:read', 'property:write'])]
    private ?string $title = null;

    #[ORM\Column(type: Types::TEXT, nullable: true)]
    #[Groups(['property:read', 'property:write'])]
    private ?string $description = null;

    #[ORM\Column(length: 255, nullable: true)]
    #[Groups(['property:read', 'property:write'])]
    private ?string $location = null;

    #[ORM\Column(nullable: true)]
    #[Groups(['property:read', 'property:write'])]
    private ?float $price = null;

    #[ORM\Column(length: 20, nullable: true)]
    #[Groups(['property:read', 'property:write'])]
    private ?string $type = null;

    #[ORM\Column(length: 20, nullable: true)]
    #[Groups(['property:read', 'property:write'])]
    private ?string $propertyType = null;

    #[ORM\Column(nullable: true)]
    #[Groups(['property:read', 'property:write'])]
    private ?int $bedrooms = null;

    #[ORM\Column(nullable: true)]
    #[Groups(['property:read', 'property:write'])]
    private ?int $bathrooms = null;

    #[ORM\Column(nullable: true)]
    #[Groups(['property:read', 'property:write'])]
    private ?float $area = null;

    #[ORM\Column(nullable: true)]
    #[Groups(['property:read', 'property:write'])]
    private ?array $images = null;

    #[ORM\Column(length: 50, nullable: true)]
    #[Groups(['property:read', 'property:write'])]
    private ?string $contactPhone = null;

    #[ORM\Column(length: 180, nullable: true)]
    #[Groups(['property:read', 'property:write'])]
    private ?string $contactEmail = null;

    #[ORM\Column]
    #[Groups(['property:read'])]
    private ?\DateTime $createdAt = null;

    // --------------- Getters & Setters ---------------

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getTitle(): ?string
    {
        return $this->title;
    }

    public function setTitle(string $title): static
    {
        $this->title = $title;
        return $this;
    }

    public function getDescription(): ?string
    {
        return $this->description;
    }

    public function setDescription(?string $description): static
    {
        $this->description = $description;
        return $this;
    }

    public function getLocation(): ?string
    {
        return $this->location;
    }

    public function setLocation(?string $location): static
    {
        $this->location = $location;
        return $this;
    }

    public function getPrice(): ?float
    {
        return $this->price;
    }

    public function setPrice(?float $price): static
    {
        $this->price = $price;
        return $this;
    }

    public function getType(): ?string
    {
        return $this->type;
    }

    public function setType(?string $type): static
    {
        $this->type = $type;
        return $this;
    }

    public function getPropertyType(): ?string
    {
        return $this->propertyType;
    }

    public function setPropertyType(?string $propertyType): static
    {
        $this->propertyType = $propertyType;
        return $this;
    }

    public function getBedrooms(): ?int
    {
        return $this->bedrooms;
    }

    public function setBedrooms(?int $bedrooms): static
    {
        $this->bedrooms = $bedrooms;
        return $this;
    }

    public function getBathrooms(): ?int
    {
        return $this->bathrooms;
    }

    public function setBathrooms(?int $bathrooms): static
    {
        $this->bathrooms = $bathrooms;
        return $this;
    }

    public function getArea(): ?float
    {
        return $this->area;
    }

    public function setArea(?float $area): static
    {
        $this->area = $area;
        return $this;
    }

    public function getImages(): ?array
    {
        return $this->images;
    }

    public function setImages(?array $images): static
    {
        $this->images = $images;
        return $this;
    }

    public function getContactPhone(): ?string
    {
        return $this->contactPhone;
    }

    public function setContactPhone(?string $contactPhone): static
    {
        $this->contactPhone = $contactPhone;
        return $this;
    }

    public function getContactEmail(): ?string
    {
        return $this->contactEmail;
    }

    public function setContactEmail(?string $contactEmail): static
    {
        $this->contactEmail = $contactEmail;
        return $this;
    }

    public function getCreatedAt(): ?\DateTime
    {
        return $this->createdAt;
    }

    public function setCreatedAt(\DateTime $createdAt): static
    {
        $this->createdAt = $createdAt;
        return $this;
    }
}
