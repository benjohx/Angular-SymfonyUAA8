<?php

namespace App\Entity;

use App\Repository\UserRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Security\Core\User\PasswordAuthenticatedUserInterface;
use Symfony\Component\Security\Core\User\UserInterface;

#[ORM\Entity(repositoryClass: UserRepository::class)]
#[ORM\Table(name: '`user`')]
#[ORM\UniqueConstraint(name: 'UNIQ_IDENTIFIER_EMAIL', fields: ['email'])]
class User implements UserInterface, PasswordAuthenticatedUserInterface
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column(type: 'integer')]
    private ?int $id = null;

    #[ORM\Column(length: 180, unique: true)]
    private ?string $email = null;

    #[ORM\Column(length: 255)]
    private ?string $name = null;

    #[ORM\Column(type: 'json')]
    private array $roles = [];

    #[ORM\Column(type: 'string')]
    private ?string $password = null;

    #[ORM\ManyToMany(targetEntity: Property::class)]
    #[ORM\JoinTable(name: 'user_saved_properties')]
    private Collection $savedProperties;

    #[ORM\Column(type: 'json', nullable: true)]
    private ?array $searchPreferences = [];

    public function __construct()
    {
        $this->savedProperties = new ArrayCollection();
        $this->searchPreferences = [];
    }

    // ----------------- Basic User fields -----------------
    public function getId(): ?int
    {
        return $this->id;
    }

    public function getEmail(): ?string
    {
        return $this->email;
    }

    public function setEmail(string $email): static
    {
        $this->email = $email;
        return $this;
    }

    public function getName(): ?string
    {
        return $this->name;
    }

    public function setName(string $name): static
    {
        $this->name = $name;
        return $this;
    }

    public function getUserIdentifier(): string
    {
        return (string)$this->email;
    }

    public function getRoles(): array
    {
        $roles = $this->roles;
        $roles[] = 'ROLE_USER'; // ensure default role
        return array_unique($roles);
    }

    public function setRoles(array $roles): static
    {
        $this->roles = $roles;
        return $this;
    }

    public function getPassword(): ?string
    {
        return $this->password;
    }

    public function setPassword(string $password): static
    {
        $this->password = $password;
        return $this;
    }

    public function eraseCredentials(): void
    {
        // Clear temporary sensitive data if any (e.g., plainPassword)
    }

    // ----------------- Saved Properties -----------------
    /**
     * @return Collection<int, Property>
     */
    public function getSavedProperties(): Collection
    {
        return $this->savedProperties;
    }

    public function addSavedProperty(Property $property): static
    {
        if (!$this->savedProperties->contains($property)) {
            $this->savedProperties->add($property);
        }
        return $this;
    }

    public function removeSavedProperty(Property $property): static
    {
        $this->savedProperties->removeElement($property);
        return $this;
    }

    // ----------------- Search Preferences -----------------
    public function getSearchPreferences(): array
    {
        return $this->searchPreferences ?? [];
    }

    public function setSearchPreferences(array $prefs): static
    {
        $this->searchPreferences = $prefs;
        return $this;
    }

    // ----------------- JSON helper for frontend -----------------
    public function toArray(): array
    {
        return [
            'id' => $this->getId(),
            'email' => $this->getEmail(),
            'name' => $this->getName(),
            'roles' => $this->getRoles(),
            'savedProperties' => $this->getSavedProperties()->map(fn($p) => $p->getId())->toArray(),
            'searchPreferences' => $this->getSearchPreferences()
        ];
    }
}
