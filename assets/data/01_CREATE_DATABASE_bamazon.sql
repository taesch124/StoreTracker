DROP DATABASE IF EXISTS bamazon;

CREATE DATABASE bamazon;
USE bamazon;

-- Create departments table
CREATE TABLE departments (
	department_id INT AUTO_INCREMENT NOT NULL,
    department_name VARCHAR(50) NOT NULL,
    over_head_costs NUMERIC(10,2) NOT NULL,
    PRIMARY KEY(department_id)
);

-- Create products table to hold purchasable items (if in stock)
CREATE TABLE products (
	item_id INT AUTO_INCREMENT NOT NULL,
    product_name VARCHAR(100) NOT NULL,
    department_id INT NOT NULL,
    price NUMERIC(10,2) NOT NULL,
    stock_quantity INTEGER DEFAULT 0 NOT NULL,
    product_sales INT DEFAULT 0 NOT NULL,
    PRIMARY KEY(item_id),
    FOREIGN KEY (department_id) REFERENCES departments(department_id)
);

INSERT INTO departments (department_name, over_head_costs)
VALUES ("Electronics & Video Games", 25000),
("Cooking", 18000),
("Music", 17500),
("Toys", 9700),
("Sports", 6300);


-- Create mock data for application
INSERT INTO products (product_name, department_id, price, stock_quantity, product_sales)
VALUES ("Assassin's Creed: Odyssey", 1, 59.99, 32, 25),
("Nintendo Switch", 1, 399.99, 9, 4),
("Kitchen Knives", 2, 74.89, 4, 42),
("Fender Electronic Guitar", 3, 149.99, 7, 3),
("Fidget Spinner", 4, 3.99, 250, 102),
("Crock Pot", 2, 299.99, 105, 15),
("Soccer Ball", 5, 18.89, 50, 9),
("Millenium Falcon Lego Set", 4, 799.99, 15, 2),
("Punching Bag", 5, 189.99, 24, 15);