-- Inserting factions
INSERT INTO `Faction` (name, leader) VALUES
("Tojo Clan", "Daigo Dojima"),
("Omi Alliance", "Masaru Watase");

-- Inserting characters
INSERT INTO `Character` (name, gender, role, tattoo, isPlayable) VALUES
("Kazuma Kiryu", "Male", "Protagonist", "Dragon", true),
("Goro Majima", "Male", "Protagonist", "Hannya", true),
("Taiga Saejima", "Male", "Protagonist", "Tiger", true),
("Ryuji Goda", "Male", "Antagonist", "Dragon", false),
("Akira Nishikiyama", "Male", "Antagonist", "Koi", false),
("Makoto Makimura", "Female", "Protagonist", "None", false),
("Haruka Sawamura", "Female", "Supporting", "None", false),
("Masaru Watase", "Male", "Supporting", "Ashura King vs Taishakuten", false),
("Daigo Dojima", "Male", "Supporting", "Fudo Myoo", false);

-- Inserting skills
INSERT INTO `Skill` (name, type, characterId) VALUES
("Tiger Drop", "Move", 1),
("Komaki Parry", "Move", 1),
("Essence of Sumo Slapping", "Heat Action", 1),
("Essence of Face Grating", "Heat Action", 1),
("Essence of the Mad Dog: Maul", "Heat Action", 2),
("Essence of Blade Biting", "Heat Action", 2),
("Essence of Puppetry", "Heat Action", 3),
("Essence of Hercules", "Heat Action", 3);

-- Linking characters to factions
INSERT INTO `CharacterToFaction` (characterId, factionId) VALUES
(1, 1), -- Kazuma Kiryu -> Tojo Clan
(2, 1), -- Goro Majima -> Tojo Clan
(3, 1), -- Taiga Saejima -> Tojo Clan
(4, 2), -- Ryuji Goda -> Omi Alliance
(5, 1); -- Akira Nishikiyama -> Tojo Clan