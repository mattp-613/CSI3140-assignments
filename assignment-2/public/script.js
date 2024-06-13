const dice = Array.from(document.querySelectorAll('.die'));
const rollButton = document.getElementById('roll-button');
const setButton = document.getElementById('set-button');
const resetButton = document.getElementById('reset-button');

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
    const scores = Array.from(document.querySelectorAll('td[id^="score-"]')).map(td => parseInt(td.textContent));
    const total = scores.reduce((sum, score) => sum + score, 0);
    document.getElementById('score-total').textContent = total;
}

dice.forEach(die => die.addEventListener('click', toggleHold));
rollButton.addEventListener('click', rollDice);
setButton.addEventListener('click', updateScore); setButton.addEventListener('click', calculateTotalScore);
resetButton.addEventListener('click', resetRoll);
