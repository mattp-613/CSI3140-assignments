<?php
session_start();

// Initialize the game state if not already set
if (!isset($_SESSION['game_state'])) {
    $_SESSION['game_state'] = [
        'dice' => [1, 2, 3, 4, 5],
        'rollCount' => 0,
        'heldDice' => [false, false, false, false, false],
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
            'total' => 0,
        ],
        'leaderboard' => []
    ];
}

$action = $_POST['action'] ?? null;

switch ($action) {
    case 'roll':
        rollDice();
        break;
    case 'set_scores':
        setScores($_POST['category'], $_POST['score']);
        break;
    case 'reset':
        resetGame();
        break;
    default:
        break;
}

echo json_encode($_SESSION['game_state']);

function rollDice() {
    if ($_SESSION['game_state']['rollCount'] < 3) {
        for ($i = 0; $i < 5; $i++) {
            if (!$_SESSION['game_state']['heldDice'][$i]) {
                $_SESSION['game_state']['dice'][$i] = rand(1, 6);
            }
        }
        $_SESSION['game_state']['rollCount']++;
    }
}

function setScores($category, $score) {
    $_SESSION['game_state']['scores'][$category] = $score;
    calculateTotalScore();
}

function calculateTotalScore() {
    $_SESSION['game_state']['scores']['total'] = array_sum($_SESSION['game_state']['scores']);
}

function resetGame() {
    $_SESSION['game_state'] = [
        'dice' => [1, 2, 3, 4, 5],
        'rollCount' => 0,
        'heldDice' => [false, false, false, false, false],
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
            'total' => 0,
        ],
        'leaderboard' => []
    ];
}
?>
