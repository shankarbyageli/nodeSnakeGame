const {stdin, stdout} = process;

let snake = [
  {
    dir : 1,
    x : 4,
    y : 1
  },
  {
    dir : 1,
    x : 3,
    y : 1
  },
  {
    dir : 1,
    x : 2,
    y : 1
  },
  {
    dir : 1,
    x : 1,
    y : 1
  }
];

let food = {
  x : 20,
  y: 20
};

let score = 0;

stdin.setRawMode(true);

const autoRunGame = function() {
  const keyStroke = ['w','d','s','a'];
  const headDir = snake[0].dir;
  const autoGamePlay = gamePlay.bind(null, keyStroke[headDir]);
  autoGamePlay();
};

const changeDirection = function(direction) {
  snake[0].dir = direction;
  moveIndir();
  for(let i = snake.length - 1; i >= 0; i--) {
    if(snake[i].dir != (snake[i-1] || snake[i]).dir) {
      snake[i].dir = snake[i-1].dir;
    }
  }
};

const moveIndir = function() {
  const operations = ["y -= 1", "x += 1", "y += 1", "x -= 1"];
  for(i in snake) {
    const operation = snake[i].dir;
    eval(`snake[i].${operations[operation]}`);
  }
};

const drawSnakeAndFood = function(snake, food) {
  stdout.cursorTo(food.x, food.y);
  stdout.write("*");
  for(i in snake) {
    stdout.cursorTo(snake[i].x, snake[i].y);
    stdout.write('o');
  }
};

const printScore = function(score) {
  const rows = stdout.rows;
  const columns = stdout.columns;
  stdout.cursorTo(0, rows-2);
  console.log("-".repeat(columns));
  stdout.cursorTo(columns-12,rows-1);
  console.log("Score : ",score);
};

const generateNewFood = function() {
  x = Math.ceil(Math.random()*140);
  y = Math.ceil(Math.random()*35);
  food.x = x;
  food.y = y;
};

const crashedToWall = function() {
  const width = stdout.columns;
  const height = stdout.rows - 3;
  return (snake[0].x < 0 || snake[0].y < 0) || (snake[0].x >= width || snake[0].y >= height);
};

const isTouchBody = function() {
  for(i in snake) {
    if(i==0) continue;
    if(snake[0].x == snake[i].x && snake[0].y == snake[i].y) {
      return true;
    }
  }
  return false;
}

const checkFoodAte = function() {
  if(snake[0].x == food.x && snake[0].y == food.y) {
    score += 5;
    generateNewFood();
    let newTail = getNewTailCords();
    obj = {
      dir : snake[snake.length-1].dir,
      x : newTail.x,
      y : newTail.y
    }
    snake.push(obj);
  }
};

const gameOverMsg = function(string) {
  console.log("\nScore : ",score);
  console.log(string);
  console.log("Game Over !");
  console.log('\x1B[?25h');
  process.exit(0);
};

const getNewTailCords = function() {
  const operations = [["x","y+1"],["x-1","y"],["x","y-1"],["x+1","y"]];
  let tail = {};
  const tailDir = snake[snake.length-1].dir;
  tail.x = eval(`snake[snake.length-1].${operations[tailDir][0]}`);
  tail.y = eval(`snake[snake.length-1].${operations[tailDir][1]}`);
  return tail;
};

let gamePlay = function(input) {
  input == 'q' && gameOverMsg("You exited the game !");
  input = input.toString();
  const keyStroke = ['w','d','s','a'];
  const moveDir = keyStroke.indexOf(input); 
  
  if(moveDir != -1) {
    if(Math.abs(moveDir-snake[0].dir)==2) {
      return ;
    }
    changeDirection(moveDir);
  }
  console.clear();  
  printScore(score);
  drawSnakeAndFood(snake, food);
  checkFoodAte(snake, food);

  isTouchBody() && gameOverMsg("Touched the snake bady !");
  crashedToWall() && gameOverMsg("Crashed to wall !");
};

const main = function() {
  stdin.on('data', (input) => {
    gamePlay(input);
  });
  console.log('\x1B[?25l');
  setInterval(autoRunGame, 300);
};

main();
