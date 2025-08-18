CREATE TABLE `Character` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(255),
  `gender` ENUM ('Male', 'Female', 'Unknown'),
  `role` ENUM ('Protagonist', 'Antagonist', 'Supporting', 'Mentor', 'Minor'),
  `tattoo` VARCHAR(255),
  `isPlayable` BOOLEAN,
  `createdAt` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE `Faction` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(255),
  `leader` VARCHAR(255),
  `createdAt` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE `CharacterToFaction` (
  `characterId` INT,
  `factionId` INT,
  PRIMARY KEY (`characterId`, `factionId`),
  `createdAt` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE `Skill` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(255),
  `type` ENUM ('Move', 'Heat Action'),
  `characterId` INT,
  `createdAt` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

ALTER TABLE `Skill` ADD FOREIGN KEY (`characterId`) REFERENCES `Character` (`id`);

ALTER TABLE `CharacterToFaction` ADD FOREIGN KEY (`characterId`) REFERENCES `Character` (`id`);

ALTER TABLE `CharacterToFaction` ADD FOREIGN KEY (`factionId`) REFERENCES `Faction` (`id`);