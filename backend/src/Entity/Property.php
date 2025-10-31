<?php

namespace App\Entity;

use Symfony\Component\Serializer\Annotation\Groups;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity]
#[ORM\Table(name: 'property')]
class Property
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column(type: 'integer')]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    #[Groups(['property'])]
    private ?string $title = null;

    #[ORM\Column(type: 'text')]
    private ?string $description = null;

    #[ORM\Column(type: 'float')]
    private ?float $price = null;

    #[ORM\Column(length: 10)]
    private ?string $type = null; // 'sale' | 'rental'

    #[ORM\Column(length: 50)]
    private ?string $propertyType = null;

    #[ORM\Column(length: 255)]
    private ?string $location = null;

    #[ORM\Column(type: 'float')]
    private ?float $area = null;

    #[ORM\Column(type: 'integer')]
    private ?int $bedrooms = null;

    #[ORM\Column(type: 'integer')]
    private ?int $bathrooms = null;

    #[ORM\Column(type: 'json')]
    private array $images = [];

    #[ORM\Column(type: 'datetime')]
    private ?\DateTimeInterface $createdAt = null;

    #[ORM\Column(length: 255)]
    private ?string $contactEmail = null;

    #[ORM\Column(length: 20)]
    private ?string $contactPhone = null;

    #[ORM\ManyToMany(targetEntity: User::class, mappedBy: 'savedProperties')]
    private Collection $savedByUsers;

    public function __construct()
    {
        $this->createdAt = new \DateTime();
        $this->images = [];
        $this->savedByUsers = new ArrayCollection();
    }

    // ----------------- Getters and Setters -----------------
    public function getId(): ?int { return $this->id; }
    public function getTitle(): ?string { return $this->title; }
    public function setTitle(string $title): self { $this->title = $title; return $this; }
    public function getDescription(): ?string { return $this->description; }
    public function setDescription(string $description): self { $this->description = $description; return $this; }
    public function getPrice(): ?float { return $this->price; }
    public function setPrice(float $price): self { $this->price = $price; return $this; }
    public function getType(): ?string { return $this->type; }
    public function setType(string $type): self { $this->type = $type; return $this; }
    public function getPropertyType(): ?string { return $this->propertyType; }
    public function setPropertyType(string $propertyType): self { $this->propertyType = $propertyType; return $this; }
    public function getLocation(): ?string { return $this->location; }
    public function setLocation(string $location): self { $this->location = $location; return $this; }
    public function getArea(): ?float { return $this->area; }
    public function setArea(float $area): self { $this->area = $area; return $this; }
    public function getBedrooms(): ?int { return $this->bedrooms; }
    public function setBedrooms(int $bedrooms): self { $this->bedrooms = $bedrooms; return $this; }
    public function getBathrooms(): ?int { return $this->bathrooms; }
    public function setBathrooms(int $bathrooms): self { $this->bathrooms = $bathrooms; return $this; }
    public function getImages(): array { return $this->images; }
    public function setImages(array $images): self { $this->images = $images; return $this; }
    public function getCreatedAt(): ?\DateTimeInterface { return $this->createdAt; }
    public function setCreatedAt(\DateTimeInterface $createdAt): self { $this->createdAt = $createdAt; return $this; }
    public function getContactEmail(): ?string { return $this->contactEmail; }
    public function setContactEmail(string $contactEmail): self { $this->contactEmail = $contactEmail; return $this; }
    public function getContactPhone(): ?string { return $this->contactPhone; }
    public function setContactPhone(string $contactPhone): self { $this->contactPhone = $contactPhone; return $this; }

    // ----------------- Saved by Users -----------------
    /**
     * @return Collection|User[]
     */
    public function getSavedByUsers(): Collection { return $this->savedByUsers; }

    public function addSavedByUser(User $user): self
    {
        if (!$this->savedByUsers->contains($user)) {
            $this->savedByUsers->add($user);
            $user->addSavedProperty($this);
        }
        return $this;
    }

    public function removeSavedByUser(User $user): self
    {
        if ($this->savedByUsers->removeElement($user)) {
            $user->removeSavedProperty($this);
        }
        return $this;
    }
}
