const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

const WIDTH = canvas.width;
const HEIGHT = canvas.height;
const CELL_SIZE = 20;
const GRID_WIDTH = WIDTH / CELL_SIZE;
const GRID_HEIGHT = HEIGHT / CELL_SIZE;

const BG_COLOR = "#141414";
const GRID_COLOR = "#1e1e1e";
const SNAKE_COLOR = "#00ff00";
const SNAKE_BORDER = "#0a280a";
const FOOD_COLOR = "#ff3232";
const TEXT_COLOR = "#00cccc";

let snake = [{ x: 5, y: 5 }];
let direction = { x: 1, y: 0 };
let food = randomPosition();
let score = 0;
let paused = false;
let gameOver = false;
let mode = "Classic";

document.addEventListener("keydown", handleKey);

function randomPosition() {
  let pos;
  do {
    pos = {
      x: Math.floor(Math.random() * GRID_WIDTH),
      y: Math.floor(Math.random() * GRID_HEIGHT)
    };
  } while (snake.some(p => p.x === pos.x && p.y === pos.y));
  return pos;
}

function handleKey(e) {
  if (e.key === "ArrowUp" && direction.y === 0) {
    direction = { x: 0, y: -1 };
  } else if (e.key === "ArrowDown" && direction.y === 0) {
    direction = { x: 0, y: 1 };
  } else if (e.key === "ArrowLeft" && direction.x === 0) {
    direction = { x: -1, y: 0 };
  } else if (e.key === "ArrowRight" && direction.x === 0) {
    direction = { x: 1, y: 0 };
  } else if (e.key === "p") {
    paused = !paused;
  } else if (e.key === "Escape") {
    window.location.href = "index.html";
  }
}

function drawGrid() {
  ctx.strokeStyle = GRID_COLOR;
  for (let x = 0; x < WIDTH; x += CELL_SIZE) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, HEIGHT);
    ctx.stroke();
  }
  for (let y = 0; y < HEIGHT; y += CELL_SIZE) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(WIDTH, y);
    ctx.stroke();
  }
}

function drawSnake() {
  snake.forEach(p => {
    ctx.fillStyle = SNAKE_COLOR;
    ctx.fillRect(p.x * CELL_SIZE, p.y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
    ctx.strokeStyle = SNAKE_BORDER;
    ctx.strokeRect(p.x * CELL_SIZE, p.y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
  });
}

function drawFood() {
  ctx.fillStyle = FOOD_COLOR;
  ctx.fillRect(food.x * CELL_SIZE, food.y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
}

function drawScore() {
  ctx.fillStyle = TEXT_COLOR;
  ctx.font = "20px Consolas";
  ctx.fillText(`Score: ${score}`, 10, 20);
}

function loop() {
  if (paused || gameOver) return;
  
  const head = { x: snake[0].x + direction.x, y: snake[0].y + direction.y };
  
  if (mode === "Classic") {
    if (head.x < 0 || head.x >= GRID_WIDTH || head.y < 0 || head.y >= GRID_HEIGHT) {
      return endGame();
    }
  } else {
    head.x = (head.x + GRID_WIDTH) % GRID_WIDTH;
    head.y = (head.y + GRID_HEIGHT) % GRID_HEIGHT;
  }

  if (snake.some(p => p.x === head.x && p.y === head.y)) {
    return endGame();
  }

  snake.unshift(head);

  if (head.x === food.x && head.y === food.y) {
    food = randomPosition();
    score++;
  } else {
    snake.pop();
  }

  ctx.fillStyle = BG_COLOR;
  ctx.fillRect(0, 0, WIDTH, HEIGHT);

  drawGrid();
  drawSnake();
  drawFood();
  drawScore();
}

function endGame() {
  gameOver = true;
  ctx.fillStyle = "red";
  ctx.font = "40px Consolas";
  ctx.fillText("Game Over", WIDTH / 2 - 100, HEIGHT / 2);
}

setInterval(loop, 100);
