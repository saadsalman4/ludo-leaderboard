-- Table to store cumulative stats
CREATE TABLE players (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    games_played INT DEFAULT 0,
    first_place INT DEFAULT 0,
    second_place INT DEFAULT 0,
    third_place INT DEFAULT 0,
    fourth_place INT DEFAULT 0,
    score FLOAT DEFAULT 0
);

-- Table to store individual games
CREATE TABLE games (
    id INT AUTO_INCREMENT PRIMARY KEY,
    date_played DATETIME DEFAULT CURRENT_TIMESTAMP,
    first_place_player VARCHAR(50) NOT NULL,
    second_place_player VARCHAR(50) NOT NULL,
    third_place_player VARCHAR(50) NOT NULL,
    fourth_place_player VARCHAR(50) NOT NULL
);
