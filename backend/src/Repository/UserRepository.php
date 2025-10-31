<?php

namespace App\Repository;

use App\Entity\User;
use App\Entity\Property;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;
use Symfony\Component\Security\Core\Exception\UnsupportedUserException;
use Symfony\Component\Security\Core\User\PasswordAuthenticatedUserInterface;
use Symfony\Component\Security\Core\User\PasswordUpgraderInterface;

/**
 * @extends ServiceEntityRepository<User>
 */
class UserRepository extends ServiceEntityRepository implements PasswordUpgraderInterface
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, User::class);
    }

    /**
     * Used to upgrade (rehash) the user's password automatically over time.
     */
    public function upgradePassword(PasswordAuthenticatedUserInterface $user, string $newHashedPassword): void
    {
        if (!$user instanceof User) {
            throw new UnsupportedUserException(sprintf('Instances of "%s" are not supported.', $user::class));
        }

        $user->setPassword($newHashedPassword);
        $this->getEntityManager()->persist($user);
        $this->getEntityManager()->flush();
    }

    // ----------------- Custom Methods -----------------

    /**
     * Find a user by email
     */
    public function findByEmail(string $email): ?User
    {
        return $this->createQueryBuilder('u')
            ->andWhere('u.email = :email')
            ->setParameter('email', $email)
            ->getQuery()
            ->getOneOrNullResult();
    }

    /**
     * Find users who saved a specific property
     *
     * @return User[]
     */
    public function findUsersBySavedProperty(Property $property): array
    {
        return $this->createQueryBuilder('u')
            ->innerJoin('u.savedProperties', 'p')
            ->andWhere('p.id = :propertyId')
            ->setParameter('propertyId', $property->getId())
            ->getQuery()
            ->getResult();
    }

    /**
     * Find users matching search preferences (optional)
     *
     * @param array $criteria
     * @return User[]
     */
    public function findBySearchPreferences(array $criteria): array
    {
        $qb = $this->createQueryBuilder('u');

        if (!empty($criteria['type'])) {
            $qb->andWhere('JSON_CONTAINS(u.searchPreferences, :type, "$.type") = 1')
                ->setParameter('type', json_encode($criteria['type']));
        }

        if (!empty($criteria['location'])) {
            $qb->andWhere('JSON_CONTAINS(u.searchPreferences, :location, "$.location") = 1')
                ->setParameter('location', json_encode($criteria['location']));
        }

        return $qb->getQuery()->getResult();
    }
}
