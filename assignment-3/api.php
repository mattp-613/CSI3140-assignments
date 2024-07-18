<?php
session_start();

if (!isset($_SESSION['gameState'])) {
    $_SESSION['gameState'] = [
        'rollCount' => 0,
        'heldDice' => [false, false, false, false, false],
        'diceValues' => [1, 2, 3, 4, 5],
        'scores' => [
            'aces' => 0,
            'twos' => 0,
            'threes' => 0,
            'fours' => 0,
            'fives' => 0,
            'sixes' => 0,
            'three of a kind' => 0,
            'four of a kind' => 0,
            'full house' => 0,
            'small straight' => 0,
            'large straight' => 0,
            'yatzy' => 0,
            'chance' => 0,
        ],
        'totalScore' => 0,
        'leaderboard' => []
    ];
}

header('Content-Type: application/json');

$action = $_GET['action'] ?? null;
$requestPayload = json_decode(file_get_contents('php://input'), true);

switch ($action) {
    case 'roll':
        if ($_SESSION['gameState']['rollCount'] < 3) {
            foreach ($_SESSION['gameState']['diceValues'] as $index => $value) {
                if (!$_SESSION['gameState']['heldDice'][$index]) {
                    $_SESSION['gameState']['diceValues'][$index] = rand(1, 6);
                }
            }
            $_SESSION['gameState']['rollCount']++;
        }
        break;

    case 'hold':
        $index = $requestPayload['index'] ?? null;
        if ($index !== null && $index >= 0 && $index < 5) {
            $_SESSION['gameState']['heldDice'][$index] = !$_SESSION['gameState']['heldDice'][$index];
        }
        break;

    case 'reset':
        $_SESSION['gameState']['rollCount'] = 0;
        $_SESSION['gameState']['heldDice'] = [false, false, false, false, false];
        $_SESSION['gameState']['diceValues'] = [1, 2, 3, 4, 5];
        break;

    case 'setScore':
        $category = $requestPayload['category'] ?? null;
        $score = $requestPayload['score'] ?? null;
        if ($category && $score !== null) {
            $_SESSION['gameState']['scores'][$category] = (int)$score;
            $_SESSION['gameState']['totalScore'] = array_sum($_SESSION['gameState']['scores']);
        }
        break;

    case 'resetGame':
        $_SESSION['gameState'] = [
            'rollCount' => 0,
            'heldDice' => [false, false, false, false, false],
            'diceValues' => [1, 2, 3, 4, 5],
            'scores' => [
                'aces' => 0,
                'twos' => 0,
                'threes' => 0,
                'fours' => 0,
                'fives' => 0,
                'sixes' => 0,
                'three of a kind' => 0,
                'four of a kind' => 0,
                'full house' => 0,
                'small straight' => 0,
                'large straight' => 0,
                'yatzy' => 0,
                'chance' => 0,
            ],
            'totalScore' => 0,
            'leaderboard' => []
        ];
        break;
        
    case 'getGameState':
    default:
        break;
}

echo json_encode($_SESSION['gameState']);
