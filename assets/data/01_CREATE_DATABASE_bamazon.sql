DROP DATABASE IF EXISTS bamazon;

CREATE DATABASE bamazon;
USE bamazon;

-- Create products table to hold purchasable items (if in stock)
CREATE TABLE products (
	item_id INT AUTO_INCREMENT NOT NULL,
    product_name VARCHAR(100) NOT NULL,
    department_name VARCHAR(50) NULL,
    price NUMERIC(10,2) NOT NULL,
    stock_quantity INTEGER DEFAULT 0 NOT NULL,
    PRIMARY KEY(item_id)
);


-- Create mock data for application
INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Assassin's Creed: Odyssey", "Electronics & Video Games", 59.99, 32),
("Nintendo Switch", "Electronics & Video Games", 399.99, 9),
("Kitchen Knives", "Cooking", 74.89, 4);