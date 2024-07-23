<?php
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "hospital_triage";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

$names = ["Alice", "Bob", "Charlie", "David", "Eve", "Frank", "Grace", "Hannah", "Ivy", "Jack"];
$codes = ["ABC", "DEF", "GHI", "JKL", "MNO", "PQR", "STU", "VWX", "YZA", "BCD"];
$severities = [1, 2, 3];
$num_patients = 10;

for ($i = 0; $i < $num_patients; $i++) {
    $name = $names[array_rand($names)];
    $code = $codes[array_rand($codes)];
    $severity = $severities[array_rand($severities)];
    $time = rand(0, 100);

    $stmt = $conn->prepare("INSERT INTO patients (name, code, severity, time) VALUES (?, ?, ?, ?)");
    $stmt->bind_param("ssii", $name, $code, $severity, $time);

    if ($stmt->execute()) {
        echo "Added patient: $name with code $code, severity $severity, and time $time\n";
    } else {
        echo "Error: " . $stmt->error . "\n";
    }

    $stmt->close();
}

$conn->close();
?>
