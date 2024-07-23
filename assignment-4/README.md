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

Once the database is set up, one can run the php file on localhost:8000 by doing 'php -S localhost:8000' in their terminal. Once that is done, you can access the website by going to localhost:8000 and seeing it there. Ensure that mariadb is running for proper database functionality.


add new patients:
php populate_database.php, or manually by php api.php add "John Doe" "XYZ" 2
check wait time:
php api.php check "John Doe" "XYZ"
list all patients:
php api.php list

One can also do this through the administrator panel. The administrator panel username and password is preset in api.php to be 'admin' and 'password', resepectively. 

The wait time the patient will see is not the same as the administrator, as the administrator will see the raw wait time but the patients wait time is calculated using this equation in the api.php file:
function calculate_wait_time($severity, $time) {
    return $severity * 10 + $time;
}
