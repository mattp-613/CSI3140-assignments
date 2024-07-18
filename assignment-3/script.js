const dice = Array.from(document.querySelectorAll('.die'));
const rollButton = document.getElementById('roll-button');
const setButton = document.getElementById('set-button');
const resetButton = document.getElementById('reset-button');
const scoreCategories = document.querySelectorAll('.score-category');

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

// Initialize event listeners
dice.forEach(die => die.addEventListener('click', toggleHold));
rollButton.addEventListener('click', rollDice);
setButton.addEventListener('click', setScores);
resetButton.addEventListener('click', resetRoll);

// Fetch initial game state
fetchGameState();
