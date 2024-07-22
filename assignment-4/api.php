<?php
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "hospital_triage";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

header('Content-Type: application/json');

$input = json_decode(file_get_contents('php://input'), true);

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if ($input['action'] === 'add') {
        $name = $input['name'];
        $code = $input['code'];
        $severity = $input['severity'];

        $stmt = $conn->prepare("INSERT INTO patients (name, code, severity, time) VALUES (?, ?, ?, ?)");
        $time = 0;
        $stmt->bind_param("ssii", $name, $code, $severity, $time);

        if ($stmt->execute()) {
            echo json_encode(['success' => true]);
        } else {
            echo json_encode(['success' => false]);
        }

        $stmt->close();
    } elseif ($input['action'] === 'check') {
        $name = $input['name'];
        $code = $input['code'];

        $stmt = $conn->prepare("SELECT severity, time FROM patients WHERE name = ? AND code = ?");
        $stmt->bind_param("ss", $name, $code);
        $stmt->execute();
        $stmt->bind_result($severity, $time);
        $stmt->fetch();

        if ($severity !== null) {
            $wait_time = calculate_wait_time($severity, $time);
            echo json_encode(['success' => true, 'wait_time' => $wait_time]);
        } else {
            echo json_encode(['success' => false]);
        }

        $stmt->close();
    }
} elseif ($_GET['action'] === 'list') {
    $result = $conn->query("SELECT name, code, severity, time FROM patients");

    $patients = [];
    while ($row = $result->fetch_assoc()) {
        $patients[] = $row;
    }

    echo json_encode(['patients' => $patients]);
}

$conn->close();

function calculate_wait_time($severity, $time) {
    // Example wait time calculation based on severity and time
    return $severity * 10 + $time;
}
?>
