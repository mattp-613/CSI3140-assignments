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

ensure to change in api.php and populate.php to a username and password that will have access to this table

Necessities:
Mariadb, php-mysqli

add new patients:
php populate_database.php, or manually by php api.php add "John Doe" "XYZ" 2
check wait time:
php api.php check "John Doe" "XYZ"
list all patients:
php api.php list

