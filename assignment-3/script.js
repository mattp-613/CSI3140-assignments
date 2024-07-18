const dice = Array.from(document.querySelectorAll('.die'));
const rollButton = document.getElementById('roll-button');
const setButton = document.getElementById('set-button');
const resetButton = document.getElementById('reset-button');
const scoreCategories = document.querySelectorAll('.score-category');
const resetGameButton = document.getElementById('reset-game-button');

function resetGame() {
    fetch('api.php?action=resetGame')
        .then(fetchGameState);
}

function fetchGameState() {
    fetch('api.php?action=getGameState')
        .then(response => response.json())
        .then(data => updateUI(data));
}

function updateUI(gameState) {
    dice.forEach((die, index) => {
        die.textContent = gameState.diceValues[index];
        die.style.backgroundColor = gameState.heldDice[index] ? '#ddd' : '#fff';
    });
    rollButton.disabled = gameState.rollCount >= 3;
    document.getElementById('score-total').textContent = gameState.totalScore;
    for (const category in gameState.scores) {
        document.getElementById(`score-${category}`).textContent = gameState.scores[category];
    }
}

function rollDice() {
    fetch('api.php?action=roll')
        .then(fetchGameState);
}

function toggleHold(event) {
    const die = event.target;
    const index = dice.indexOf(die);
    fetch('api.php?action=hold', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ index })
    }).then(fetchGameState);
}

function resetRoll() {
    fetch('api.php?action=reset')
        .then(fetchGameState);
}

function setScores() {
    const selectedCategory = prompt("Enter the category to set the score:");
    if (selectedCategory) {
        const score = calculateScoreForCategory(selectedCategory);
        if (score !== null) {
            fetch('api.php?action=setScore', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ category: selectedCategory, score })
            }).then(fetchGameState);
        } else {
            alert("Invalid category or score calculation failed.");
        }
    }
}

function calculateScoreForCategory(category) {
    const diceValues = dice.map(die => parseInt(die.textContent));
    const counts = [0, 0, 0, 0, 0, 0];
    
    diceValues.forEach(value => {
        counts[value - 1]++;
    });

    switch (category) {
        case 'aces':
            return counts[0] * 1;
        case 'twos':
            return counts[1] * 2;
        case 'threes':
            return counts[2] * 3;
        case 'fours':
            return counts[3] * 4;
        case 'fives':
            return counts[4] * 5;
        case 'sixes':
            return counts[5] * 6;
        case 'three of a kind':
            for (let i = 0; i < 6; i++) {
                if (counts[i] >= 3) {
                    return diceValues.reduce((sum, value) => sum + value, 0);
                }
            }
            return 0;
        case 'four of a kind':
            for (let i = 0; i < 6; i++) {
                if (counts[i] >= 4) {
                    return diceValues.reduce((sum, value) => sum + value, 0);
                }
            }
            return 0;
        case 'full house':
            if (counts.includes(3) && counts.includes(2)) {
                return 25;
            }
            return 0;
        case 'small straight':
            if ((counts[0] >= 1 && counts[1] >= 1 && counts[2] >= 1 && counts[3] >= 1) ||
                (counts[1] >= 1 && counts[2] >= 1 && counts[3] >= 1 && counts[4] >= 1) ||
                (counts[2] >= 1 && counts[3] >= 1 && counts[4] >= 1 && counts[5] >= 1)) {
                return 30;
            }
            return 0;
        case 'large straight':
            if ((counts[1] >= 1 && counts[2] >= 1 && counts[3] >= 1 && counts[4] >= 1 && counts[5] >= 1) ||
                (counts[0] >= 1 && counts[1] >= 1 && counts[2] >= 1 && counts[3] >= 1 && counts[4] >= 1)) {
                return 40;
            }
            return 0;
        case 'yatzy':
            if (counts.includes(5)) {
                return 50;
            }
            return 0;
        case 'chance':
            return diceValues.reduce((sum, value) => sum + value, 0);
        default:
            return null;
    }
}

dice.forEach(die => die.addEventListener('click', toggleHold));
rollButton.addEventListener('click', rollDice);
setButton.addEventListener('click', setScores);
resetButton.addEventListener('click', resetRoll);
resetGameButton.addEventListener('click', resetGame);


fetchGameState();
