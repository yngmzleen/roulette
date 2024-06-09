let balance = 100;
let gameHistory = [];
let wins = 0;

function playGame(playerChoice) {
  const bet = parseInt(document.getElementById('bet').value);
  if (isNaN(bet) || bet < 1 || bet > balance) {
    alert('Please enter a valid bet amount within your balance.');
    return;
  }

  const choices = ['rock', 'paper', 'scissors'];
  const computerChoice = choices[Math.floor(Math.random() * 3)];
  const playerImage = document.getElementById('player-choice');
  const computerImage = document.getElementById('computer-choice');

  // Показать камень во время анимации
  playerImage.src = 'rock.png';
  computerImage.src = 'rock.png';

  // Добавить анимацию
  playerImage.classList.add('shake');
  computerImage.classList.add('shake');

  // Удалить класс анимации и сменить изображения после завершения анимации
  setTimeout(() => {
    playerImage.classList.remove('shake');
    computerImage.classList.remove('shake');

    // Сменить изображения на выбор игрока и компьютера
    playerImage.src = playerChoice + '.png';
    computerImage.src = computerChoice + '.png';

    // Определить и показать результат
    const result = determineWinner(playerChoice, computerChoice);
    document.getElementById('result').innerText = `You chose ${playerChoice}, computer chose ${computerChoice}. ${result}`;

    // Показать оверлей с результатом
    showOverlay(result);

    // Обновить баланс в зависимости от результата
    updateBalance(result, bet);

    // Добавить результат в историю
    addHistoryItem(playerChoice, computerChoice, result);

    // Увеличить счетчик побед, если игрок выиграл
    if (result === 'win') {
      wins++;
    }

    // Обновить прогресс рейтинга
    updateRating();

    // Обновить сообщение о рейтинге
    updateRatingMessage();
  }, 1500); // 3 * 0.5s = 1.5s
}

function determineWinner(playerChoice, computerChoice) {
  if (playerChoice === computerChoice) {
    return "draw";
  }
  if (
    (playerChoice === 'rock' && computerChoice === 'scissors') ||
    (playerChoice === 'scissors' && computerChoice === 'paper') ||
    (playerChoice === 'paper' && computerChoice === 'rock')
  ) {
    return "win";
  } else {
    return "loose";
  }
}

function showOverlay(result) {
  const overlay = document.getElementById('overlay');
  overlay.className = result;
  overlay.innerText = result === "win" ? "Win!" : (result === "loose" ? "Loose!" : "Draw!");
  overlay.style.visibility = 'visible';
  overlay.style.opacity = '1';
  setTimeout(() => {
    overlay.style.visibility = 'hidden';
    overlay.style.opacity = '0';
  }, 1000); // Оверлей будет виден 1 секунду
}

function updateBalance(result, bet) {
  if (result === 'win') {
    balance += bet;
  } else if (result === 'loose') {
    balance -= bet;
  }
  document.getElementById('balance').innerText = `Balance: $${balance}`;
}

function addHistoryItem(playerChoice, computerChoice, result) {
  const item = {
    playerChoice,
    computerChoice,
    result,
    timestamp: new Date().toLocaleString()
  };
  gameHistory.push(item);
  localStorage.setItem('gameHistory', JSON.stringify(gameHistory));
}

function updateRating() {
  const rating = document.getElementById('rating');
  if (wins >= 40) {
    rating.value = 40;
    rating.style.backgroundColor = 'blue';
  } else if (wins >= 30) {
    rating.value = 30;
    rating.style.backgroundColor = 'yellow';
  } else if (wins >= 20) {
    rating.value = 20;
    rating.style.backgroundColor = 'silver';
  } else if (wins >= 10) {
    rating.value = 10;
    rating.style.backgroundColor = 'orange';
  } else {
    rating.value = 0;
    rating.style.backgroundColor = 'gray';
  }
}

function updateRatingMessage() {
  const currentRating = document.getElementById('current-rating');
  const remainingGames = document.getElementById('remaining-games');
  if (wins >= 40) {
    currentRating.textContent = 'Brilliant';
    remainingGames.textContent = '0';
  } else if (wins >= 30) {
    currentRating.textContent = 'Gold';
    remainingGames.textContent = 40 - wins;
  } else if (wins >= 20) {
    currentRating.textContent = 'Silver';
    remainingGames.textContent = 30 - wins;
  } else if (wins >= 10) {
    currentRating.textContent = 'Bronze';
    remainingGames.textContent = 20 - wins;
  } else {
    currentRating.textContent = 'No rating';
    remainingGames.textContent = 10 - wins;
  }
}
function toggleLanguage(checked) {
  const englishElements = document.querySelectorAll('.lang-en');
  const russianElements = document.querySelectorAll('.lang-ru');

  if (checked) {
    // Скрываем английский текст и показываем русский
    englishElements.forEach(element => element.style.display = 'none');
    russianElements.forEach(element => element.style.display = 'block');
  } else {
    // Скрываем русский текст и показываем английский
    englishElements.forEach(element => element.style.display = 'block');
    russianElements.forEach(element => element.style.display = 'none');
  }
}
// Загрузить историю из localStorage при загрузке страницы
window.onload = function() {
const storedHistory = localStorage.getItem('gameHistory');
if (storedHistory) {
gameHistory = JSON.parse(storedHistory);
}
}