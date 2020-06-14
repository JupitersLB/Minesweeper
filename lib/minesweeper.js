const tableGrid = document.querySelectorAll('td');
const width = Math.sqrt(tableGrid.length);
const numOfMines = 10;
let flags = 0;
let isGameOver = false;
const smileyFace = document.querySelector('.reset img');
const flagCountdown = document.querySelector('.flags-left h3');
const timerCount = document.querySelector('.timer');
const body = document.querySelector('body');

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
      if (i > 8 && tableGrid[i - width].classList.contains('mine')) total += 1;
      if (i > 9 && !leftEdge && tableGrid[i - 1 - width].classList.contains('mine')) total += 1;
      if (i < 63 && !rightEdge && tableGrid[i + 1].classList.contains('mine')) total += 1;
      if (i < 56 && !leftEdge && tableGrid[i - 1 + width].classList.contains('mine')) total += 1;
      if (i < 54 && !rightEdge && tableGrid[i + 1 + width].classList.contains('mine')) total += 1;
      if (i < 55 && tableGrid[i + width].classList.contains('mine')) total += 1;

      square.setAttribute('data', total);
    }
    i += 1;
  });
};

const createGame = () => {
  setSquareID();
  addMines();
  setMineNumberVicinity();
};

createGame();

const gameOver = (square) => {
  setTimeout(() => {
    alert('BOOM!! Game Over');
  }, 20);
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
    alert('WINNER!');
    isGameOver = true;
  }
};

function click(square) {
  const total = parseInt(square.getAttribute('data'), 10);
  if (isGameOver) return;
  if (square.classList.contains('mine')) {
    gameOver(square);
  } else if (total === 1) {
    square.classList.add('mine-neighbour-1');
  } else if (total === 2) {
    square.classList.add('mine-neighbour-2');
  } else if (total === 3) {
    square.classList.add('mine-neighbour-3');
  } else if (total === 4) {
    square.classList.add('mine-neighbour-4');
  } else if (total === 5) {
    square.classList.add('mine-neighbour-5');
  } else if (total === 6) {
    square.classList.add('mine-neighbour-6');
  } else if (total === 7) {
    square.classList.add('mine-neighbour-7');
  } else if (total === 8) {
    square.classList.add('mine-neighbour-8');
  } else if (total === 0) {
    square.classList.add('opened');
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
    if (sqId < 55) {
      const newId = parseInt(tableGrid[sqId + width].id, 10);
      const newSquare = document.getElementById(newId);
      click(newSquare);
    }
  }, 20);
};

const countUp = () => {
  let time = 0;
  setInterval(() => {
    time += 1;
    timerCount.innerText = time;
  }, 600);
  console.log(time);
};


tableGrid.forEach((square) => {
  square.addEventListener('click', (event) => {
    click(square);
  });
  square.addEventListener('contextmenu', (event) => {
    event.preventDefault();
    addFlag(square);
  });
});

smileyFace.addEventListener('click', event => window.location.reload());

body.addEventListener('click', (event) => {
  if (timerCount.innerText === '0') countUp();
});
