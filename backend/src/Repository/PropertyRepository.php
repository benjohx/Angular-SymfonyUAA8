<?php

namespace App\Repository;

use App\Entity\Property;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<Property>
 */
class PropertyRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Property::class);
    }

    /**
     * Search properties by filters
     */
    public function searchProperties(array $filters): array
    {
        $qb = $this->createQueryBuilder('p');

        if (!empty($filters['type'])) {
            $qb->andWhere('p.type = :type')
               ->setParameter('type', $filters['type']);
        }

        if (!empty($filters['propertyType'])) {
            $qb->andWhere('p.propertyType = :propertyType')
               ->setParameter('propertyType', $filters['propertyType']);
        }

        if (!empty($filters['location'])) {
            $qb->andWhere('p.location LIKE :location')
               ->setParameter('location', '%' . $filters['location'] . '%');
        }

        if (!empty($filters['minPrice'])) {
            $qb->andWhere('p.price >= :minPrice')
               ->setParameter('minPrice', $filters['minPrice']);
        }

        if (!empty($filters['maxPrice'])) {
            $qb->andWhere('p.price <= :maxPrice')
               ->setParameter('maxPrice', $filters['maxPrice']);
        }

        if (!empty($filters['minBedrooms'])) {
            $qb->andWhere('p.bedrooms >= :minBedrooms')
               ->setParameter('minBedrooms', $filters['minBedrooms']);
        }

        return $qb->orderBy('p.createdAt', 'DESC')->getQuery()->getResult();
    }
}
