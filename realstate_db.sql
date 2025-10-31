-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3306
-- Generation Time: Oct 31, 2025 at 10:45 PM
-- Server version: 9.1.0
-- PHP Version: 8.3.14

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `realstate_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `doctrine_migration_versions`
--

DROP TABLE IF EXISTS `doctrine_migration_versions`;
CREATE TABLE IF NOT EXISTS `doctrine_migration_versions` (
  `version` varchar(191) COLLATE utf8mb3_unicode_ci NOT NULL,
  `executed_at` datetime DEFAULT NULL,
  `execution_time` int DEFAULT NULL,
  PRIMARY KEY (`version`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;

--
-- Dumping data for table `doctrine_migration_versions`
--

INSERT INTO `doctrine_migration_versions` (`version`, `executed_at`, `execution_time`) VALUES
('DoctrineMigrations\\Version20251030090540', '2025-10-30 09:05:50', 152);

-- --------------------------------------------------------

--
-- Table structure for table `property`
--

DROP TABLE IF EXISTS `property`;
CREATE TABLE IF NOT EXISTS `property` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `price` double NOT NULL,
  `type` varchar(10) COLLATE utf8mb4_unicode_ci NOT NULL,
  `property_type` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `location` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `area` double NOT NULL,
  `bedrooms` int NOT NULL,
  `bathrooms` int NOT NULL,
  `images` json NOT NULL,
  `created_at` datetime NOT NULL,
  `contact_email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `contact_phone` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
CREATE TABLE IF NOT EXISTS `user` (
  `id` int NOT NULL AUTO_INCREMENT,
  `email` varchar(180) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `roles` json NOT NULL,
  `password` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `search_preferences` json DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UNIQ_IDENTIFIER_EMAIL` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `user`
--

INSERT INTO `user` (`id`, `email`, `name`, `roles`, `password`, `search_preferences`) VALUES
(1, 'jackson@bibliotheque.com', 'Benimana Josue', '[\"ROLE_USER\"]', '$2y$13$D/9wi.SmiGE8djq0OIfYjOftkFmgeOzCJ8UKA2Lj1ra89eDCa9DqO', '[]'),
(2, 'rose@bibliotheque.com', 'Marrie Rose', '[\"ROLE_USER\"]', '$2y$13$a3KyXLp4I1QF1bfVZ0x0YeAI0z74jt9tmcm.wFMj392a6uWHDgzCO', '[]'),
(3, 'joy@bibliotheque.com', 'Umutoni joy', '[\"ROLE_USER\"]', '$2y$13$Uq6X4.kfcVhMzmF0DkxM6utfqMiOFNeCIpCb7u.2ZCS75cKpwLrUm', '[]'),
(4, 'john@bibliotheque.com', 'john Walker', '[\"ROLE_USER\"]', '$2y$13$Jj0FBwCNcau/ynVlCdtYo.vS4Vz9p3fcKX8SLW1LG6jzmNsV1Y3pC', '[]');

-- --------------------------------------------------------

--
-- Table structure for table `user_saved_properties`
--

DROP TABLE IF EXISTS `user_saved_properties`;
CREATE TABLE IF NOT EXISTS `user_saved_properties` (
  `user_id` int NOT NULL,
  `property_id` int NOT NULL,
  PRIMARY KEY (`user_id`,`property_id`),
  KEY `IDX_39EF26F2A76ED395` (`user_id`),
  KEY `IDX_39EF26F2549213EC` (`property_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `user_saved_properties`
--
ALTER TABLE `user_saved_properties`
  ADD CONSTRAINT `FK_39EF26F2549213EC` FOREIGN KEY (`property_id`) REFERENCES `property` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `FK_39EF26F2A76ED395` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
