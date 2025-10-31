-- ----------------------
-- Table structure for Utilisateur
-- ----------------------
CREATE TABLE Utilisateur (
  id_user INT AUTO_INCREMENT PRIMARY KEY,
  nom VARCHAR(255) NOT NULL,
  prenom VARCHAR(255),
  email VARCHAR(255) NOT NULL,
  mot_de_passe VARCHAR(255) NOT NULL,
  telephone VARCHAR(50),
  role ENUM('client','proprietaire','admin') NOT NULL
);

-- ----------------------
-- Table structure for Bien
-- ----------------------
CREATE TABLE Bien (
  id_bien INT AUTO_INCREMENT PRIMARY KEY,
  titre VARCHAR(255) NOT NULL,
  description TEXT,
  type_bien VARCHAR(255),
  adresse VARCHAR(255),
  ville VARCHAR(255),
  code_postal VARCHAR(20),
  surface FLOAT,
  prix FLOAT,
  statut ENUM('en_vente','en_location','vendu','loué') NOT NULL,
  date_publication DATE,
  photo_principale VARCHAR(255)
);

-- ----------------------
-- Table structure for Photo
-- ----------------------
CREATE TABLE Photo (
  id_photo INT AUTO_INCREMENT PRIMARY KEY,
  url_photo VARCHAR(255),
  id_bien INT,
  FOREIGN KEY (id_bien) REFERENCES Bien(id_bien) ON DELETE CASCADE
);

-- ----------------------
-- Table structure for Annonce
-- ----------------------
CREATE TABLE Annonce (
  id_annonce INT AUTO_INCREMENT PRIMARY KEY,
  id_bien INT NOT NULL,
  id_proprietaire INT NOT NULL,
  type_annonce ENUM('vente','location') NOT NULL,
  date_debut DATE,
  date_fin DATE,
  FOREIGN KEY (id_bien) REFERENCES Bien(id_bien) ON DELETE CASCADE,
  FOREIGN KEY (id_proprietaire) REFERENCES Utilisateur(id_user) ON DELETE CASCADE
);

-- ----------------------
-- Table structure for Favori
-- ----------------------
CREATE TABLE Favori (
  id_favori INT AUTO_INCREMENT PRIMARY KEY,
  id_user INT NOT NULL,
  id_bien INT NOT NULL,
  date_ajout DATE,
  FOREIGN KEY (id_user) REFERENCES Utilisateur(id_user) ON DELETE CASCADE,
  FOREIGN KEY (id_bien) REFERENCES Bien(id_bien) ON DELETE CASCADE
);

-- ----------------------
-- Table structure for MessageContact
-- ----------------------
CREATE TABLE MessageContact (
  id_message INT AUTO_INCREMENT PRIMARY KEY,
  nom VARCHAR(255),
  email VARCHAR(255),
  sujet VARCHAR(255),
  message TEXT,
  date_envoi DATE
);

-- ----------------------
-- Table structure for Simulateur_Pret
-- ----------------------
CREATE TABLE Simulateur_Pret (
  id_simulation INT AUTO_INCREMENT PRIMARY KEY,
  id_user INT NOT NULL,
  montant_emprunt FLOAT,
  duree INT,
  taux_interet FLOAT,
  mensualite_resultat FLOAT,
  date_simulation DATE,
  FOREIGN KEY (id_user) REFERENCES Utilisateur(id_user) ON DELETE CASCADE
);
