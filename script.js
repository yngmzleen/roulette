let balance = 100;
let gameHistory = [];
let wins = 0;

function playGame(playerChoice) {
  const bet = Number(document.getElementById('bet').value);
  if (isNaN(bet) || bet < 1 || bet > balance) {
    const message = languageCheckbox.checked ? 'Please enter a valid bet amount within your balance.' : 'Пожалуйста, введите действительную сумму ставки в пределах вашего баланса.';
    alert(message);
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
  const ratingImage = document.getElementById('rating-image');

  if (wins >= 4) {
    rating.value = 4;
    ratingImage.src = 'brilliant.png';
  } else if (wins >= 3) {
    rating.value = 3;
    ratingImage.src = 'gold.png';
  } else if (wins >= 2) {
    rating.value = 2;
    ratingImage.src = 'silver.png';
  } else if (wins >= 1) {
    rating.value = 1;
    ratingImage.src = 'bronze.png';
  } else {
    rating.value = 0;
    ratingImage.src = 'Выиграйте 1 игру!'; 
  }
}

function updateRatingMessage() {
  const currentRating = document.getElementById('current-rating');
  const remainingGames = document.getElementById('remaining-games');
  if (wins >= 4) {
    currentRating.textContent = 'Brilliant';
    remainingGames.textContent = '0';
  } else if (wins >= 3) {
    currentRating.textContent = 'Gold';
    remainingGames.textContent = 4 - wins;
  } else if (wins >= 2) {
    currentRating.textContent = 'Silver';
    remainingGames.textContent = 3 - wins;
  } else if (wins >= 1) {
    currentRating.textContent = 'Bronze';
    remainingGames.textContent = 2 - wins;
  } else {
    currentRating.textContent = 'No rating';
    remainingGames.textContent = 1 - wins;
  }
}
function toggleLanguage(checked) {
  const englishElements = document.querySelectorAll('.lang-en');


  if (checked) {
    // Скрываем английский текст и показываем русский
    englishElements.forEach(element => element.style.display = 'none');
    russianElements.forEach(element => element.style.display = 'block');
  } else {
    // Скрываем русский текст и показываем английский
    englishElements.forEach(element => element.style.display = 'block');
    russianElements.forEach(element => element.style.display = 'none');
  }

  // Сохраняем состояние чекбокса в localStorage
  localStorage.setItem('language', checked ? 'en' : 'ru');

  // Обновляем все текстовые элементы
  updateTextElements();
}

// Проверяем состояние чекбокса при загрузке страницы
window.onload = function() {
  const language = localStorage.getItem('language') || 'en';
  const languageCheckbox = document.getElementById('language');
  languageCheckbox.checked = language === 'en';
  toggleLanguage(languageCheckbox.checked);
};

// Функция для обновления всех текстовых элементов
function updateTextElements() {
  const englishElements = document.querySelectorAll('.lang-en');
  const russianElements = document.querySelectorAll('.lang-ru');

  if (languageCheckbox.checked) {
    // Скрываем английский текст и показываем русский
    englishElements.forEach(element => element.style.display = 'none');
    russianElements.forEach(element => element.style.display = 'block');
  } else {
    // Скрываем русский текст и показываем английский
    englishElements.forEach(element => element.style.display = 'block');
    russianElements.forEach(element => element.style.display = 'none');
  }
}