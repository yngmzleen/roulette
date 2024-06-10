let players = [];
let gameInterval;
let bettingInterval;
let countdownInterval;
let rouletteSpinning = false;
let rouletteSpeed = 150;

function startBetting() {
    clearRoulette();
    bettingInterval = setInterval(endBetting, 20000);
    startCountdown(20);
}

function endBetting() {
    clearInterval(bettingInterval);
    players = players.filter(player => player.hasPlacedBet);
    fillRoulette();
    spinRoulette();
    gameInterval = setInterval(endGame, 10000);
    startCountdown(10);
}

function fillRoulette() {
    let slots = document.querySelector('.slots');
    slots.innerHTML = '';

    players.forEach(player => {
        let numSlots = Math.floor(player.bet);
        for (let i = 0; i < numSlots; i++) {
            let slot = document.createElement('div');
            slot.className = `slot ${player.color}`;
            slot.innerText = `${player.name} (${player.bet.toFixed(2)})`;
            slots.appendChild(slot);
        }
    });

    slots.classList.add('spinning');
    rouletteSpinning = true;
    spinRoulette();
}

function spinRoulette() {
    let slots = document.querySelector('.slots');
    let currentRotation = 0;
    let targetRotation = Math.floor(Math.random() * 3600) + 7200;
    let finalRotation = 0;
    let accelerationTime = 5000;
    let decelerationTime = 5000;
    let startTime = null;
    let isAccelerating = true;
    let initialSpeed = 150;
    let currentSpeed = initialSpeed;

    function animateRoulette(timestamp) {
        if (!startTime) startTime = timestamp;

        let elapsedTime = timestamp - startTime;
        if (isAccelerating) {
            currentSpeed = initialSpeed - (elapsedTime / accelerationTime) * (initialSpeed - rouletteSpeed);
        } else {
            currentSpeed = rouletteSpeed - (elapsedTime / decelerationTime) * rouletteSpeed;
        }

        if (elapsedTime >= accelerationTime) {
            isAccelerating = false;
        }

        currentRotation += currentSpeed;
        slots.style.transform = `rotate(${currentRotation}deg)`;

        if (elapsedTime >= accelerationTime + decelerationTime) {
            rouletteSpinning = false;
            finalRotation = currentRotation;
            slots.addEventListener('transitionend', endGame);
            slots.style.transition = 'transform 5s ease-in-out';
            slots.style.transform = `rotate(${targetRotation % 360}deg)`;
            return;
        }

        requestAnimationFrame(animateRoulette);
    }

    requestAnimationFrame(animateRoulette);
}

function getWinner() {
    let slots = document.querySelector('.slots');
    let currentRotation = parseFloat(slots.style.transform.replace('rotate(', '').replace('deg)', ''));
    let numSlots = 37;
    let anglePerSlot = 360 / numSlots;
    let numRotations = Math.floor(currentRotation / 360);
    currentRotation -= numRotations * 360;
    let winningSlot = Math.floor(currentRotation / anglePerSlot);
    
    for (let player of players) {
        if (Math.floor(player.bet) === winningSlot) {
            return player;
        }
    }
    
    return null;
}

function showResultModal(message) {
    let modal = document.getElementById("result-modal");
    let resultText = document.getElementById("result-text");

    resultText.textContent = message;
    modal.style.display = "block";

    let closeButton = document.querySelector(".close-btn");
    closeButton.onclick = function() {
        modal.style.display = "none";
    }

    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }

    setTimeout(() => {
        modal.style.display = "none";
    }, 5000);
}

function clearRoulette() {
    let slots = document.querySelector('.slots');
    slots.innerHTML = '';
    slots.classList.remove('spinning');
    slots.style.transform = 'rotate(0deg)';
    slots.style.transition = '';
    rouletteSpinning = false;
}

function endGame() {
    clearInterval(gameInterval);
    let winner = getWinner();
    
    if (winner) {
        showResultModal(`Победитель: ${winner.name}, Ставка: ${winner.bet.toFixed(2)}`);
    } else {
        showResultModal("Нет победителя!");
    }

    setTimeout(() => {
        players = [];
        startBetting();
    }, 5000);
}

function placeBet(playerName, betAmount, betColor) {
    players.push({ name: playerName, bet: betAmount, color: betColor, hasPlacedBet: true });
    document.querySelector('.place-bet-button').innerText = 'Ваша ставка принята!';
    setTimeout(() => {
        document.querySelector('.place-bet-button').innerText = 'Ставка';
    }, 10000);
}

function getRandomColor() {
    let colors = ['red', 'green', 'black', 'purple'];
return colors[Math.floor(Math.random() * colors.length)];
}

function startCountdown(duration) {
let timer = duration, seconds;
let countdownElement = document.getElementById('timer');
clearInterval(countdownInterval);
countdownInterval = setInterval(() => {
seconds = parseInt(timer % 60, 10);
countdownElement.textContent = seconds;
if (--timer < 0) {
    clearInterval(countdownInterval);
}
}, 1000);
}

function simulateOtherPlayers() {
    // Добавляем 9 дополнительных игроков со случайными ставками и цветами
    for (let i = 1; i <= 9; i++) {
    let betAmount = +(Math.random() * 10).toFixed(2); // Ставка от 0 до 10 с двумя знаками после запятой
    let betColor = getRandomColor();
    placeBet(Player, {i}, betAmount, betColor);
    }
    }
    
    document.addEventListener('DOMContentLoaded', () => {
    startBetting();
    document.querySelectorAll('.bet-btn').forEach(button => {
        button.addEventListener('click', () => {
            document.getElementById('bet-amount').value = button.dataset.amount;
        });
    });
    
    document.querySelector('.place-bet-button').addEventListener('click', () => {
        let betAmount = parseFloat(document.getElementById('bet-amount').value);
        let betColor = getRandomColor(); // Присваиваем цвет случайным образом
        placeBet('Player', betAmount, betColor);
        simulateOtherPlayers(); // Добавляем дополнительных игроков
    });
});    
