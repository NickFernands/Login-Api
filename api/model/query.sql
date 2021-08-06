CREATE DATABASE Login;

USE Login;

CREATE TABLE users (
        id INT NOT NULL
        name VARCHAR(255) NOT NULL
        username VARCHAR(255) NOT NULL UNIQUE
        email VARCHAR(255) NOT NULL UNIQUE
        password VARCHAR(255) NOT NULL

        PRIMARY KEY(id)
    )
