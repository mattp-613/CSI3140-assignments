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

if (php_sapi_name() == "cli") {
    //Commands to interface with database
    $action = $argv[1] ?? null;

    if ($action === 'add') {
        $name = $argv[2] ?? null;
        $code = $argv[3] ?? null;
        $severity = $argv[4] ?? null;

        if ($name && $code && $severity) {
            $stmt = $conn->prepare("INSERT INTO patients (name, code, severity, time) VALUES (?, ?, ?, ?)");
            $time = 0;
            $stmt->bind_param("ssii", $name, $code, $severity, $time);

            if ($stmt->execute()) {
                echo json_encode(['success' => true]);
            } else {
                echo json_encode(['success' => false]);
            }

            $stmt->close();
        } else {
            echo "Usage: php api.php add <name> <code> <severity>\n";
        }
    } elseif ($action === 'check') {
        $name = $argv[2] ?? null;
        $code = $argv[3] ?? null;

        if ($name && $code) {
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
        } else {
            echo "Usage: php api.php check <name> <code>\n";
        }
    } elseif ($action === 'list') {
        $result = $conn->query("SELECT name, code, severity, time FROM patients");

        $patients = [];
        while ($row = $result->fetch_assoc()) {
            $patients[] = $row;
        }

        echo json_encode(['patients' => $patients]);
    } else {
        echo "Usage: php api.php <add|check|list> [params...]\n";
    }
} else {
    //Website mode
    if (isset($_SERVER['REQUEST_METHOD'])) {
        if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($input['action'])) {
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
        } elseif ($_SERVER['REQUEST_METHOD'] === 'GET' && isset($_GET['action']) && $_GET['action'] === 'list') {
            $result = $conn->query("SELECT name, code, severity, time FROM patients");

            $patients = [];
            while ($row = $result->fetch_assoc()) {
                $patients[] = $row;
            }

            echo json_encode(['patients' => $patients]);
        }
    }
}

$conn->close();

function calculate_wait_time($severity, $time) {
    return $severity * 10 + $time;
}
?>
