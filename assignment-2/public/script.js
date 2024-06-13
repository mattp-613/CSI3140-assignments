const dice = Array.from(document.querySelectorAll('.die'));
const rollButton = document.getElementById('roll-button');
const setButton = document.getElementById('set-button');
const resetButton = document.getElementById('reset-button');
const scoreCategories = document.querySelectorAll('.score-category');

let rollCount = 0;
let heldDice = [false, false, false, false, false];

function rollDice() {
    if (rollCount < 3) {
        dice.forEach((die, index) => {
            if (!heldDice[index]) {
                const roll = Math.floor(Math.random() * 6) + 1;
                die.textContent = roll;
            }
        });
        rollCount++;
    }
}

function toggleHold(event) {
    const die = event.target;
    const index = dice.indexOf(die);
    heldDice[index] = !heldDice[index];
    die.style.backgroundColor = heldDice[index] ? '#ddd' : '#fff';
}

function resetRoll() {
    rollCount = 0;
    heldDice.fill(false);
    dice.forEach((die, index) => {
        die.style.backgroundColor = '#fff';
        die.textContent = index + 1;
    });
}

function updateScore(category, score) {
    document.getElementById(`score-${category}`).textContent = score;
    calculateTotalScore();
}

function calculateTotalScore() {
    const scores = Array.from(document.querySelectorAll('td[id^="score-"]'))
        .map(td => parseInt(td.textContent) || 0);
    const total = scores.reduce((sum, score) => sum + score, 0);
    document.getElementById('score-total').textContent = total;
}

function setScores() { //TODO!!!! Make it so u click a category to add the score
    const selectedCategory = prompt("Enter the category to set the score:");
    if (selectedCategory) {
        const score = calculateScoreForCategory(selectedCategory);
        if (score !== null) {
            updateScore(selectedCategory, score);
        } else {
            alert("Invalid category or score calculation failed.");
        }
    }
}

function calculateScoreForCategory(category) {  //TODO: Fix full house, straights, etc...
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
        case 'three of a kind': //TODO: add only the three of a kind
            for (let i = 0; i < 6; i++) {
                if (counts[i] >= 3) {
                    return diceValues.reduce((sum, value) => sum + value, 0);
                }
            }
            return 0;
        case 'four of a kind': //TODO: add only the four of a kind
            for (let i = 0; i < 6; i++) {
                if (counts[i] >= 4) {
                    return diceValues.reduce((sum, value) => sum + value, 0);
                }
            }
            return 0;
            case 'full house': // DO THIS
                return 25;
            case 'small straight': // DO THIS
                return 30;
            case 'large straight': // DO THIS
                return 40;
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
