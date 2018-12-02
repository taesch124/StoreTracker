USE bamazon;

DROP TABLE IF EXISTS cart;

CREATE TABLE cart (
    user_id INT NOT NULL,
    item_id INT NOT NULL,
    quantity INT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (item_id) REFERENCES products (item_id) ON DELETE CASCADE
);

INSERT INTO cart
VALUES (1,1,2),
(1,14,5);