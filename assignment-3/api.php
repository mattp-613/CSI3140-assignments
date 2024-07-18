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

switch ($action) {
    case 'roll':
        if ($_SESSION['gameState']['rollCount'] < 2) {
            foreach ($_SESSION['gameState']['diceValues'] as $index => $value) {
                if (!$_SESSION['gameState']['heldDice'][$index]) {
                    $_SESSION['gameState']['diceValues'][$index] = rand(1, 6);
                }
            }
            $_SESSION['gameState']['rollCount']++;
        }
        break;

    case 'hold':
        $index = $_POST['index'] ?? null;
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
        $category = $_POST['category'] ?? null;
        $score = $_POST['score'] ?? null;
        if ($category && $score !== null) {
            $_SESSION['gameState']['scores'][$category] = (int)$score;
            $_SESSION['gameState']['totalScore'] = array_sum($_SESSION['gameState']['scores']);
        }
        break;

    case 'getGameState':
    default:
        // Default action is to return the game state
        break;
}

echo json_encode($_SESSION['gameState']);
