const tableGrid = document.querySelectorAll('td');
const width = Math.sqrt(tableGrid.length);
const smileyFace = document.querySelector('.reset img');
const flagCountdown = document.querySelector('.flags-left h3');
const timerCount = document.querySelector('.timer h3');
const body = document.querySelector('body');
let switchMode = document.querySelector('.switch-mode');



let numOfMines = 10;
let flags = 0;
let sec = 0;
let min = 0;
let isGameOver = false;
let isClockStarted = false;


const getRandomNumer = () => {
  const num = Math.floor(Math.random() * tableGrid.length);
  return num;
};

const setSquareID = () => {
  let i = 0;
  tableGrid.forEach((square) => {
    square.setAttribute('id', i);
    i += 1;
  });
};

const addMines = () => {
  if (tableGrid.length <= 64) {
    let i;
    for (i = 0; i < numOfMines; i += 1) {
      tableGrid[getRandomNumer()].classList.add('mine');
    }
  }
};

const setMineNumberVicinity = () => {
  let i = 0;
  tableGrid.forEach((square) => {
    let total = 0;
    const leftEdge = (i % width === 0);
    const rightEdge = (i % width === width - 1);

    if (square.classList.contains('mine') === false) {
      if (i > 0 && !leftEdge && tableGrid[i - 1].classList.contains('mine')) total += 1;
      if (i > 7 && !rightEdge && tableGrid[i + 1 - width].classList.contains('mine')) total += 1;
      if (i > 7 && tableGrid[i - width].classList.contains('mine')) total += 1;
      if (i > 8 && !leftEdge && tableGrid[i - 1 - width].classList.contains('mine')) total += 1;
      if (i < 63 && !rightEdge && tableGrid[i + 1].classList.contains('mine')) total += 1;
      if (i < 56 && !leftEdge && tableGrid[i - 1 + width].classList.contains('mine')) total += 1;
      if (i < 55 && !rightEdge && tableGrid[i + 1 + width].classList.contains('mine')) total += 1;
      if (i < 56 && tableGrid[i + width].classList.contains('mine')) total += 1;

      square.setAttribute('data', total);
    }
    i += 1;
  });
};

const createGame = () => {
  setSquareID();
  addMines();
  setMineNumberVicinity();
  numOfMines = document.querySelectorAll('.mine').length;
  flagCountdown.innerText = `Flags left: ${numOfMines - flags}`;
};

createGame();

const timerLayout = () => {
  if (sec === 60) {
    min += 1;
    sec = 0;
    timerCount.innerText = `${min}:0${sec}`;
  } else if (sec < 10) {
    timerCount.innerText = `${min}:0${sec}`;
  } else {
    timerCount.innerText = `${min}:${sec}`;
  }
};

const gameOver = (square) => {
  setTimeout(() => {
    alert('BOOM!! Game Over');
  }, 10);
  isGameOver = true;
  tableGrid.forEach((squares) => {
    if (squares.classList.contains('mine')) squares.classList.remove('unopened');
  });
};

const winGame = () => {
  let disarms = 0;
  tableGrid.forEach((square) => {
    if (square.classList.contains('mine') && square.classList.contains('flagged')) {
      disarms += 1;
    }
  });
  if (disarms === numOfMines) {
    alert(`WINNER! You took ${timerCount.innerText}!`);
    isGameOver = true;
  }
};

function click(square) {
  const total = parseInt(square.getAttribute('data'), 10);
  if (isGameOver) return;
  if (square.classList.contains('opened') || square.classList.contains('flagged')) return;
  if (square.classList.contains('mine')) {
    gameOver(square);
  } else if (total !== 0) {
    square.classList.add(`mine-neighbour-${total}`);
    square.classList.remove('unopened');

  } else {
    square.classList.add('opened')
    square.classList.remove('unopened');
    checkSquare(square);
  }
}

const addFlag = (square) => {
  if (isGameOver) return;
  if (square.classList.contains('unopened') && flags < numOfMines) {
    if (!square.classList.contains('flagged')) {
      square.classList.add('flagged');
      flags += 1;
      flagCountdown.innerText = `Flags left: ${numOfMines - flags}`;
      winGame();
    } else {
      square.classList.remove('flagged');
      flags -= 1;
      flagCountdown.innerText = `Flags left: ${numOfMines - flags}`;
    }
  }
};

const countUp = () => {
  setInterval(() => {
    if (isGameOver) return;
    sec += 1;
    timerLayout();
  }, 1000);
};

const checkSquare = (square) => {
  const sqId = parseInt(square.id, 10);
  const leftEdge = (sqId % width === 0);
  const rightEdge = (sqId % width === width - 1);

  setTimeout(() => {
    if (sqId > 0 && !leftEdge) {
      const newId = parseInt(tableGrid[sqId - 1].id, 10);
      const newSquare = document.getElementById(newId);
      click(newSquare);
    }
    if (sqId > 7 && !rightEdge) {
      const newId = parseInt(tableGrid[sqId + 1 - width].id, 10);
      const newSquare = document.getElementById(newId);
      click(newSquare);
    }
    if (sqId > 8) {
      const newId = parseInt(tableGrid[sqId - width].id, 10);
      const newSquare = document.getElementById(newId);
      click(newSquare);
    }
    if (sqId > 9 && !leftEdge) {
      const newId = parseInt(tableGrid[sqId - 1 - width].id, 10);
      const newSquare = document.getElementById(newId);
      click(newSquare);
    }
    if (sqId < 63 && !rightEdge) {
      const newId = parseInt(tableGrid[sqId + 1].id, 10);
      const newSquare = document.getElementById(newId);
      click(newSquare);
    }
    if (sqId < 56 && !leftEdge) {
      const newId = parseInt(tableGrid[sqId - 1 + width].id, 10);
      const newSquare = document.getElementById(newId);
      click(newSquare);
    }
    if (sqId < 54 && !rightEdge) {
      const newId = parseInt(tableGrid[sqId + 1 + width].id, 10);
      const newSquare = document.getElementById(newId);
      click(newSquare);
    }
    if (sqId < 56) {
      const newId = parseInt(tableGrid[sqId + width].id, 10);
      const newSquare = document.getElementById(newId);
      click(newSquare);
    }
  }, 5);
};

tableGrid.forEach((square) => {
  square.addEventListener('click', (event) => {
    switchMode = document.querySelector('.switch-mode');
    if (switchMode.classList.contains('flagged-button')) {
      addFlag(square);
    } else {
    click(square);
    }
  });
  square.addEventListener('contextmenu', (event) => {
    event.preventDefault();
    addFlag(square);
  });
});

smileyFace.addEventListener('click', event => window.location.reload());

body.addEventListener('click', (event) => {
  if (!isClockStarted) {
    isClockStarted = true;
    countUp();
  }
});

switchMode.addEventListener('click', (event) => {
  switchMode.classList.toggle('mine-button');
  switchMode.classList.toggle('flagged-button');
})

