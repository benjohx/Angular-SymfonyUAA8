<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20251101191252 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE property (id INT AUTO_INCREMENT NOT NULL, title VARCHAR(255) NOT NULL, description LONGTEXT NOT NULL, price DOUBLE PRECISION NOT NULL, type VARCHAR(10) NOT NULL, property_type VARCHAR(50) NOT NULL, location VARCHAR(255) NOT NULL, area DOUBLE PRECISION NOT NULL, bedrooms INT NOT NULL, bathrooms INT NOT NULL, images JSON NOT NULL, created_at DATETIME NOT NULL, contact_email VARCHAR(255) NOT NULL, contact_phone VARCHAR(20) NOT NULL, PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE `user` (id INT AUTO_INCREMENT NOT NULL, email VARCHAR(180) NOT NULL, name VARCHAR(255) NOT NULL, roles JSON NOT NULL, password VARCHAR(255) NOT NULL, search_preferences JSON DEFAULT NULL, UNIQUE INDEX UNIQ_IDENTIFIER_EMAIL (email), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE user_saved_properties (user_id INT NOT NULL, property_id INT NOT NULL, INDEX IDX_39EF26F2A76ED395 (user_id), INDEX IDX_39EF26F2549213EC (property_id), PRIMARY KEY(user_id, property_id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('ALTER TABLE user_saved_properties ADD CONSTRAINT FK_39EF26F2A76ED395 FOREIGN KEY (user_id) REFERENCES `user` (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE user_saved_properties ADD CONSTRAINT FK_39EF26F2549213EC FOREIGN KEY (property_id) REFERENCES property (id) ON DELETE CASCADE');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE user_saved_properties DROP FOREIGN KEY FK_39EF26F2A76ED395');
        $this->addSql('ALTER TABLE user_saved_properties DROP FOREIGN KEY FK_39EF26F2549213EC');
        $this->addSql('DROP TABLE property');
        $this->addSql('DROP TABLE `user`');
        $this->addSql('DROP TABLE user_saved_properties');
    }
}
