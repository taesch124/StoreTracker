USE bamazon;

DROP TABLE IF EXISTS users;

CREATE TABLE users (
    user_id INT AUTO_INCREMENT NOT NULL,
    username VARCHAR(25) NOT NULL,
    password VARCHAR(25) NOT NULL,
    permission_level INT DEFAULT 1 NOT NULL,
    PRIMARY KEY (user_id)
);

INSERT INTO users (username, password, permission_level)
VALUES ("bob", "1234", 1000);