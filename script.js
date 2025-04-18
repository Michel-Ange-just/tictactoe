
let currentPlayer = "X";
let board = ["", "", "", "", "", "", "", "", ""];
let isSolo = true;
let theme = true; //true wenn hell
let level = "";
let playerScore = 0;
let botScore = 0;


// Start the game

window.onload = function () {
    loadGame();
}

function save() {
    const gameState = {
        board,
        currentPlayer,
        playerScore,
        botScore
    };
    localStorage.setItem("ticTacToe", JSON.stringify(gameState));
}

function loadGame() {
    const savedState = localStorage.getItem("ticTacToe");
    if (savedState) {
        const { board: savedBoard, currentPlayer: savedPlayer, level:savedLevel, playerScore: savedPlayerScore, botScore: savedBotScore} = JSON.parse(savedState);
        board = savedBoard || board;
        currentPlayer = savedPlayer || currentPlayer;
        level = level || savedPlayerScore;
        playerScore = playerScore || savedPlayerScore;
        botScore = botScore || savedBotScore;
        update();
    }
}

function update() {
    board.forEach((cell, index) => {
        const cellElement = document.getElementById(`cell-${index}`);
        cellElement.innerText = cell;
        cellElement.classList.remove("bg-green-500", "animate-pulse"); 
    });
}


function startGame(mode) {
    if ( mode == 'solo' ){
        isSolo = mode === 'solo';
        document.getElementById("homeScreen").classList.add("hidden");
        document.getElementById("gameScreen").classList.add("hidden");
        document.getElementById("levelScreen").classList.remove("hidden");
        resetGame(); 
    }
    else if ( mode == 'friend'){
        document.getElementById("homeScreen").classList.add("hidden");
        document.getElementById("gameScreen").classList.remove("hidden");
        document.getElementById("levelScreen").classList.add("hidden");
        resetGame();
    }
    else if(mode = 'old'){
        document.getElementById("homeScreen").classList.add("hidden");
        document.getElementById("gameScreen").classList.remove("hidden");
        loadGame();
    }
   
}

function intellige (chooseLevel) {
    level = chooseLevel;
    document.getElementById("homeScreen").classList.add("hidden");
    document.getElementById("gameScreen").classList.remove("hidden");
    document.getElementById("levelScreen").classList.add("hidden");
   
}

function changeTheme(color){
    if (color == 'sun'){
        document.getElementById("body").classList.remove("text-white");
        document.getElementById("homeScreen").classList.remove("bg-neutral-900");
        document.getElementById("gameScreen").classList.remove("bg-neutral-900");
        document.getElementById("rulesScreen").classList.remove("bg-neutral-900");
        document.getElementById("schatten1").classList.add("hidden");
        document.getElementById("schatten2").classList.remove("hidden");
        document.getElementById("homeScreen").classList.add("bg-neutral-300");
        document.getElementById("gameScreen").classList.add("bg-neutral-300");
        document.getElementById("rulesScreen").classList.add("bg-neutral-300");
        document.getElementById("levelScreen").classList.add("bg-neutral-300");
        document.getElementById("levelScreen").classList.remove("bg-neutral-900");
        changeTheme(color);
        }
    else if(color == 'moon') {
        document.getElementById("body").classList.add("text-white");
        document.getElementById("homeScreen").classList.remove("bg-neutral-300");
        document.getElementById("gameScreen").classList.remove("bg-neutral-300");
        document.getElementById("rulesScreen").classList.remove("bg-neutral-300");
        document.getElementById("schatten2").classList.add("hidden");
        document.getElementById("schatten1").classList.remove("hidden");
        document.getElementById("homeScreen").classList.add("bg-neutral-900");
        document.getElementById("gameScreen").classList.add("bg-neutral-900");
        document.getElementById("rulesScreen").classList.add("bg-neutral-900");
        document.getElementById("levelScreen").classList.remove("bg-neutral-300");
        document.getElementById("levelScreen").classList.add("bg-neutral-900");
        changeTheme(color);
    }
    
}

function showRules() {
    document.getElementById("homeScreen").classList.add("hidden");
    document.getElementById("gameScreen").classList.add("hidden");
    document.getElementById("rulesScreen").classList.remove("hidden");
    document.getElementById("levelScreen").classList.add("hidden");
}

function goHome() {
    document.getElementById("homeScreen").classList.remove("hidden");
    document.getElementById("gameScreen").classList.add("hidden");
    document.getElementById("rulesScreen").classList.add("hidden");
    document.getElementById("levelScreen").classList.add("hidden");
}

function makeMove(index){

    if(board[index] !== ""){
        return;
    }
    board[index] = currentPlayer;
    document.getElementById(`cell-${index}`).innerText = currentPlayer;
    
    const winPattern = checkWin();
    if (winPattern) {
        if (currentPlayer === "X") {
            playerScore++;
        } else {
            botScore++;
        }
        updateScore(); // Mettre à jour l'affichage du score
       
        winPattern.forEach(i => {
            const winningCell = document.getElementById(`cell-${i}`);
            winningCell.classList.add("bg-green-500", "animate-bounce"); 
        });
        const timeout = setTimeout(() => {
            alert(`${currentPlayer} wins!`);
            save(); 
            resetGame1();
        }, 10);
        animation.push(timeout); 
        return;
    }


    if(board.every(cell => cell !== "")){
        const timeout = setTimeout(() => {
            alert("It's a draw!");
            resetGame1(); 
        }, 10); 
        animation.push(timeout);
        return;
    }


    currentPlayer = currentPlayer === "X" ? "O" : "X";

    if(isSolo && currentPlayer === "O"){
        botMove();
    }
    save(); 
}

function updateScore() { // Mettre à jour les scores
    document.getElementById("playerScore").innerText = `You: ${playerScore}`;
    document.getElementById("botScore").innerText = `Bot: ${botScore}`;
}
function resetScores() { //  réinitialiser le score
    playerScore = 0;
    botScore = 0;
    updateScore(); 
}

function checkWin(){
    const winPatterns = [
        [0,1,2], [3,4,5], [6,7,8],
        [0,3,6], [1,4,7], [2,5,8],
        [0,4,8], [2,4,6]
    ]

    return winPatterns.find(pattern => pattern.every(index => board[index] === currentPlayer));

}

function findBestMove(player) {
    const winPatterns = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], 
        [0, 3, 6], [1, 4, 7], [2, 5, 8], 
        [0, 4, 8], [2, 4, 6]             
    ];

    for (const pattern of winPatterns) {
        const playerCount = pattern.filter(index => board[index] === player).length;
        const emptyCount = pattern.filter(index => board[index] === "").length;

    // Si le joueur a deux cases vides adjacentes et une case vide à côté, il peut gagner

        if (playerCount === 2 && emptyCount === 1) {
            const move = pattern.find(index => board[index] === "");
            return move;
        }
    }

    return null;
}

function botMove() {
    const emptyCells = board.map((cell, i) => (cell === "" ? i : null)).filter(i => i !== null);
    
    if (level === 'beginner') {
        // Bot joue de manière aléatoire
        const randomIndex = emptyCells[Math.floor(Math.random() * emptyCells.length)];
        makeMove(randomIndex);
    } else if (level ==='amateur') {
        // Bot joue de manière semi-intelligente
        const blockingMove = findBestMove("X"); // Bloque le joueur si nécessaire
        if (blockingMove !== null) {
            makeMove(blockingMove);
        } else {
            const randomIndex = emptyCells[Math.floor(Math.random() * emptyCells.length)];
            makeMove(randomIndex);
        }
    } else if (level === 'professional') {
        // Bot joue de manière intelligente
        const bestMove = minimax(board, "O");
        if (bestMove !== null) {
            makeMove(bestMove.index);
        }
    }
}

function minimax(newBoard, player) {
    const emptyCells = newBoard.map((cell, i) => (cell === "" ? i : null)).filter(i => i !== null);

   
    if (checkWinWithPlayer(newBoard, "X")) return { score: -1 }; 
    if (checkWinWithPlayer(newBoard, "O")) return { score: 1 };  
    if (emptyCells.length === 0) return { score: 0 };            

    // Collection des mouvements
    const moves = [];

    // Parcourir chaque case vide
    for (const cell of emptyCells) {
        const move = {};
        move.index = cell;
        newBoard[cell] = player; // Simuler le mouvement

        if (player === "O") {
            // Minimiser le score de l'adversaire
            const result = minimax(newBoard, "X");
            move.score = result.score;
        } else {
            // Maximiser le score pour "O"
            const result = minimax(newBoard, "O");
            move.score = result.score;
        }

        newBoard[cell] = ""; // Revenir à l'état précédent
        moves.push(move);
    }

    // Choisir le meilleur mouvement
    let bestMove;
    if (player === "O") {
        let bestScore = -Infinity;      // plus grnad valeur possible
        for (const move of moves) {
            if (move.score > bestScore) {
                bestScore = move.score;
                bestMove = move;
            }
        }
    } else {
        let bestScore = Infinity;
        for (const move of moves) {
            if (move.score < bestScore) {
                bestScore = move.score;
                bestMove = move;
            }
        }
    }

    return bestMove;
}
function checkWinWithPlayer(currentBoard, player) {
    const winPatterns = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6]
    ];
    return winPatterns.some(pattern => pattern.every(index => currentBoard[index] === player));
}

function resetGame() {
    board = ["", "", "", "", "", "", "", "", ""];
    currentPlayer = "X";
    resetScores();
    document.querySelectorAll("[id ^= cell]").forEach(cell => (cell.innerText = ""));
    document.querySelectorAll("[id^=cell]").forEach(cell => {
        cell.innerText = ""; 
        cell.classList.remove("bg-green-500", "animate-bounce"); 
    });
    animation.forEach(timeout => clearTimeout(timeout));
    animation = [];
    save();
}

function resetGame1() {
    board = ["", "", "", "", "", "", "", "", ""];
    currentPlayer = "X";
    
    document.querySelectorAll("[id ^= cell]").forEach(cell => (cell.innerText = ""));
    document.querySelectorAll("[id^=cell]").forEach(cell => {
        cell.innerText = ""; 
        cell.classList.remove("bg-green-500", "animate-bounce"); 
    });
    animation.forEach(timeout => clearTimeout(timeout));
    animation = [];
    save();
}

function back(){
    save();
    goHome();
}

