Creating the database:

CREATE DATABASE hospital_triage;

USE hospital_triage;

CREATE TABLE patients (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    code VARCHAR(3) NOT NULL,
    severity INT NOT NULL,
    time INT NOT NULL DEFAULT 0
);

