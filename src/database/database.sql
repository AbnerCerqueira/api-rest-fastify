CREATE DATABASE fastify;

USE fastify;

CREATE TABLE user(
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(100) UNIQUE,
    password VARCHAR(100)
);
