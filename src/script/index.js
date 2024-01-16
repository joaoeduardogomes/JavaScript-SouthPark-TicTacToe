//* Global variables:
const boardAreas = document.querySelectorAll('.game-area');
let vBoard = []; // virtual board
let turnPlayer = '';

const player1 = {
    name: '',
    img: 'src/img/stan.svg',
    marker: 'X'
}

const player2 = {
    name: '',
    img: 'src/img/cartman.svg',
    marker: 'O'
}

function changeTurnPlayer(currentPlayer) {
    turnPlayer = currentPlayer;
    const playerArea = document.querySelector('span#turnPlayer');
    playerArea.textContent = currentPlayer;
}

function startGame() {
    // initialize global variable:
    vBoard = [
        ['', '', ''],
        ['', '', ''],
        ['', '', '']
    ];

    // Creating the span#turnPlayer again (the winGame delets it):
    const h2 = document.querySelector('h2');
    h2.textContent = 'Turn: ';
    const h2Span = document.createElement('span');
    h2Span.id = 'turnPlayer';
    h2.appendChild(h2Span);

    // get the players names. If nothing is inserted, we et standard names:
    player1.name = document.querySelector('input#player1').value;
    if (player1.name === '') player1.name = 'Stan';
    player2.name = document.querySelector('input#player2').value;
    if (player2.name === '') player2.name = 'Cartman';
    changeTurnPlayer(player1.name);

    //* clear board (if necessary) and add click event:
    boardAreas.forEach((area) => {

        area.innerHTML = '';
        // if we are restarting a game, we must clear the .win areas:
        area.classList.remove('win');
        area.addEventListener('click', handleBoardClick); // mark an area as clicked
    })
}

function handleBoardClick(ev) {
    // the span .game-area that was clicked:
    const areaBox = ev.currentTarget;
    // the dataset of the span .game-area that was clicked:
    const areaDataset = ev.currentTarget.dataset.area;

    // we get the row/column pair by spliting the element dataset:
    const rowColumnPair = areaDataset.split('.');
    console.log(rowColumnPair)
    const row = rowColumnPair[0];
    const column = rowColumnPair[1];

    if (turnPlayer === player1.name) {
        const playerImg = document.createElement('img');
        playerImg.src = player1.img;
        areaBox.appendChild(playerImg);
        vBoard[row][column] = player1.marker;
    }
    else {
        const playerImg = document.createElement('img');
        playerImg.src = player2.img;
        areaBox.appendChild(playerImg);
        vBoard[row][column] = player2.marker;
    }

    // clear the console and show the vBoard:
    console.clear();
    console.table(vBoard);


    // disable the clicked area:
    disableRegion(areaBox);

    // checking if some won the game:
    const winRegions = getWinRegions();

    if (winRegions.length > 0) {
        handleWin(winRegions);
    }
    else if (!vBoard.flat().includes('')) {
        // All cells are filled, it's a tie
        document.querySelector('h2').innerText = "It's a tie!";
    }
    else {
        // There are empty cells, continue the game
        turnPlayer = turnPlayer === player1.name ? player2.name : player1.name;
        changeTurnPlayer(turnPlayer);
    }
}

function disableRegion(ev) {
    // disable an area of the board and make it unclickable.

    ev.removeEventListener('click', handleBoardClick);
}

function getWinRegions() {
    const winRegions = [];

    // checking lines:
    if ((vBoard[0][0] === vBoard[0][1]) && (vBoard[0][1] === vBoard[0][2]) && (vBoard[0][0] !== ''))
        winRegions.push("0.0", "0.1", "0.2");
    if ((vBoard[1][0] === vBoard[1][1]) && (vBoard[1][1] === vBoard[1][2]) && (vBoard[1][0] !== ''))
        winRegions.push("1.0", "1.1", "1.2");
    if ((vBoard[2][0] === vBoard[2][1]) && (vBoard[2][1] === vBoard[2][2]) && (vBoard[2][0] !== ''))
        winRegions.push("2.0", "2.1", "2.2");

    // checking columns:
    if ((vBoard[0][0] === vBoard[1][0]) && (vBoard[1][0] === vBoard[2][0]) && (vBoard[0][0] !== ''))
        winRegions.push("0.0", "1.0", "2.0");
    if ((vBoard[0][1] === vBoard[1][1]) && (vBoard[1][1] === vBoard[2][1]) && (vBoard[0][1] !== ''))
        winRegions.push("0.1", "1.1", "2.1");
    if ((vBoard[0][2] === vBoard[1][2]) && (vBoard[1][2] === vBoard[2][2]) && (vBoard[0][2] !== ''))
        winRegions.push("0.2", "1.2", "2.2");

    // checking diagonals:
    if ((vBoard[0][0] === vBoard[1][1]) && (vBoard[1][1] === vBoard[2][2]) && (vBoard[0][0] !== ''))
        winRegions.push("0.0", "1.1", "2.2");
    if ((vBoard[0][2] === vBoard[1][1]) && (vBoard[1][1] === vBoard[2][0]) && (vBoard[0][2] !== ''))
        winRegions.push("0.2", "1.1", "2.0");

    return winRegions;
}

function handleWin(areas) {
    areas.forEach((area) => {
        console.log(area)
        const winArea = document.querySelector(`[data-area="${area}"]`).classList.add('win');
        console.log(winArea)
    });

    const winner = turnPlayer;
    document.querySelector('h2').innerText = `${winner} is the winner!`;

    // disable the board:
    boardAreas.forEach((area) => {
        area.removeEventListener('click', handleBoardClick);
    })
}

