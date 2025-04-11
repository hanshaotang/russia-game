const grid = document.querySelector('.grid');
const scoreDisplay = document.getElementById('score');
const levelDisplay = document.getElementById('level');
const startButton = document.getElementById('start-btn');
const width = 10;
let squares = Array.from(grid.querySelectorAll('div'));
let currentPosition = 4;
let currentRotation = 0;
let timerId;
let score = 0;
let level = 1;
let speed = 1000;

// 方块形状
const lTetromino = [
    [1, width+1, width*2+1, 2],
    [width, width+1, width+2, width*2+2],
    [1, width+1, width*2+1, width*2],
    [width, width*2, width*2+1, width*2+2]
];

const zTetromino = [
    [0, width, width+1, width*2+1],
    [width+1, width+2, width*2, width*2+1],
    [0, width, width+1, width*2+1],
    [width+1, width+2, width*2, width*2+1]
];

const tTetromino = [
    [1, width, width+1, width+2],
    [1, width+1, width+2, width*2+1],
    [width, width+1, width+2, width*2+1],
    [1, width, width+1, width*2+1]
];

const oTetromino = [
    [0, 1, width, width+1],
    [0, 1, width, width+1],
    [0, 1, width, width+1],
    [0, 1, width, width+1]
];

const iTetromino = [
    [1, width+1, width*2+1, width*3+1],
    [width, width+1, width+2, width+3],
    [1, width+1, width*2+1, width*3+1],
    [width, width+1, width+2, width+3]
];

const theTetrominoes = [lTetromino, zTetromino, tTetromino, oTetromino, iTetromino];

let random = Math.floor(Math.random() * theTetrominoes.length);
let current = theTetrominoes[random][currentRotation];

// 绘制方块
function draw() {
    current.forEach(index => {
        squares[currentPosition + index].classList.add('block');
        squares[currentPosition + index].classList.add(theTetrominoes[random][0][0]);
    });
}

// 擦除方块
function undraw() {
    current.forEach(index => {
        squares[currentPosition + index].classList.remove('block');
        squares[currentPosition + index].classList.remove(theTetrominoes[random][0][0]);
    });
}

// 控制方块下落
function moveDown() {
    undraw();
    currentPosition += width;
    draw();
    freeze();
}

// 冻结方块
function freeze() {
    if (current.some(index => squares[currentPosition + index + width].classList.contains('block2'))) {
        current.forEach(index => squares[currentPosition + index].classList.add('block2'));
        random = Math.floor(Math.random() * theTetrominoes.length);
        current = theTetrominoes[random][currentRotation];
        currentPosition = 4;
        draw();
        addScore();
    }
}

// 控制移动
function moveLeft() {
    undraw();
    const isAtLeftEdge = current.some(index => (currentPosition + index) % width === 0);
    if (!isAtLeftEdge) currentPosition -= 1;
    if (current.some(index => squares[currentPosition + index].classList.contains('block2'))) {
        currentPosition += 1;
    }
    draw();
}

function moveRight() {
    undraw();
    const isAtRightEdge = current.some(index => (currentPosition + index) % width === width - 1);
    if (!isAtRightEdge) currentPosition += 1;
    if (current.some(index => squares[currentPosition + index].classList.contains('block2'))) {
        currentPosition -= 1;
    }
    draw();
}

// 旋转方块
function rotate() {
    undraw();
    currentRotation++;
    if (currentRotation === current.length) {
        currentRotation = 0;
    }
    current = theTetrominoes[random][currentRotation];
    draw();
}

// 显示下一个方块
function showNext() {
    // 实现显示下一个方块的功能
}

// 计分
function addScore() {
    for (let i = 0; i < 199; i += width) {
        const row = [i, i+1, i+2, i+3, i+4, i+5, i+6, i+7, i+8, i+9];
        if (row.every(index => squares[index].classList.contains('block2'))) {
            score += 10;
            level = Math.floor(score / 100) + 1;
            speed = Math.max(100, 1000 - (level - 1) * 100);
            scoreDisplay.innerHTML = score;
            levelDisplay.innerHTML = level;
            row.forEach(index => {
                squares[index].classList.remove('block2');
                squares[index].classList.remove('block');
            });
            const squaresRemoved = squares.splice(i, width);
            squares = squaresRemoved.concat(squares);
            squares.forEach(cell => grid.appendChild(cell));
        }
    }
}

// 游戏结束
function gameOver() {
    if (current.some(index => squares[currentPosition + index].classList.contains('block2'))) {
        scoreDisplay.innerHTML = 'end';
        clearInterval(timerId);
    }
}

// 键盘控制
function control(e) {
    if (e.keyCode === 37) {
        moveLeft();
    } else if (e.keyCode === 38) {
        rotate();
    } else if (e.keyCode === 39) {
        moveRight();
    } else if (e.keyCode === 40) {
        moveDown();
    }
}
document.addEventListener('keydown', control);

// 开始游戏
startButton.addEventListener('click', () => {
    if (timerId) {
        clearInterval(timerId);
        timerId = null;
    } else {
        draw();
        timerId = setInterval(moveDown, speed);
    }
});