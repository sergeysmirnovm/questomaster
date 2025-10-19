// Загрузка загадок
let riddles = [];
let currentStage = 0;
let collectedFragments = [];

async function loadRiddles() {
  const response = await fetch('assets/templates/animatronics.json');
  const data = await response.json();
  riddles = data.riddles;
}

function startGame() {
  document.getElementById('start-screen').style.display = 'none';
  document.getElementById('game-screen').style.display = 'flex';
  loadRiddles().then(() => showRiddle(0));
}

function showRiddle(index) {
  if (index >= riddles.length) {
    showFinalReveal();
    return;
  }

  const r = riddles[index];
  document.getElementById('riddle-box').innerHTML = `
    <h2>Загадка ${index + 1} из ${riddles.length}</h2>
    <p>${r.text.replace(/\n/g, '<br>')}</p>
    <p class="hint">${r.hint}</p>
    <input type="text" id="answer" placeholder="Введи ключ..." autocomplete="off">
    <p id="feedback" style="color:#e74c3c; margin-top:10px;"></p>
  `;
  document.getElementById('answer').focus();
  document.getElementById('answer').onkeypress = (e) => {
    if (e.key === 'Enter') checkAnswer();
  };
}

function checkAnswer() {
  const input = document.getElementById('answer').value.trim().toLowerCase();
  const r = riddles[currentStage];
  const feedback = document.getElementById('feedback');

  if (input === r.key) {
    feedback.textContent = '✅ Верно!';
    feedback.style.color = '#2ecc71';

    // Подсветка на карте
    document.getElementById(`loc${currentStage + 1}`).classList.add('collected');

    // Сохраняем фрагмент
    collectedFragments.push(r.fragment);

    setTimeout(() => {
      document.getElementById('riddle-box').style.display = 'none';
      document.getElementById('fragment-text').textContent = `«${r.fragment}»`;
      document.getElementById('fragment-box').style.display = 'block';
    }, 800);
  } else {
    feedback.textContent = '❌ Неверно. Попробуй снова!';
  }
}

function nextRiddle() {
  document.getElementById('fragment-box').style.display = 'none';
  document.getElementById('riddle-box').style.display = 'block';
  currentStage++;

  // Анимация игрока
  const positions = [
    {top: '20px', left: '30px'},
    {top: '60px', left: '120px'},
    {top: '120px', left: '40px'},
    {top: '180px', left: '130px'},
    {top: '240px', left: '50px'},
    {top: '100px', left: '80px'},
    {top: '280px', left: '90px'}
  ];
  const player = document.getElementById('player');
  player.style.top = positions[currentStage].top;
  player.style.left = positions[currentStage].left;

  if (currentStage >= riddles.length) {
    showFinalReveal();
  } else {
    showRiddle(currentStage);
  }
}

function showFinalReveal() {
  // Попробуем загрузить фото подарка
  const img = new Image();
  img.src = 'gift_location.jpg';
  img.onload = () => {
    document.getElementById('final-reveal').innerHTML = `
      <h2>🎉 Поздравляем!</h2>
      <p>Ты нашёл все фрагменты!</p>
      <img src="gift_location.jpg" style="max-width:80%; border:3px solid gold; border-radius:10px;">
      <p>Подарок ждёт тебя здесь!</p>
    `;
  };
  img.onerror = () => {
    document.getElementById('final-reveal').innerHTML = `
      <h2>🎉 Поздравляем!</h2>
      <p>Ты нашёл все фрагменты!</p>
      <p style="color:gold;font-size:18px;">Подарок спрятан в кладовой, внутри переноски для кошек!</p>
    `;
  };
  document.getElementById('final-reveal').style.display = 'block';
}