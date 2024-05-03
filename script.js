const Board = (() => {
  let tokenCounter = 0;
  let theBoard = [
    { id: "r1c1", content: null },
    { id: "r1c2", content: null },
    { id: "r1c3", content: null },
    { id: "r2c1", content: null },
    { id: "r2c2", content: null },
    { id: "r2c3", content: null },
    { id: "r3c1", content: null },
    { id: "r3c2", content: null },
    { id: "r3c3", content: null },
  ];

  const resetBoard = () => {
    tokenCounter = 0;
    for (let i = 0; i < 9; i++) {
      theBoard[i].content = null;
    }
  };

  const placeToken = (token, cellName) => {
    let index = theBoard.findIndex((cell) => cell.id === cellName);
    if (theBoard[index].content === null) {
      theBoard[index].content = token;
      tokenCounter++;
    } else console.log("You can't place a token there");
    if (tokenCounter >= 9) {
      GameControl.tieGame();
    }
  };

  const checkBoardForWin = () => {
    if (
      //Check for r1/c1 - r1/c2 - r1/c3
      (theBoard[0].content === theBoard[1].content &&
        theBoard[0].content === theBoard[2].content &&
        theBoard[0].content !== null) ||
      //Check for r2/c1 - r2/c2 - r2/c3
      (theBoard[3].content === theBoard[4].content &&
        theBoard[3].content === theBoard[5].content &&
        theBoard[3].content !== null) ||
      //Check for r3/c1 - r3/c2 - r3/c3
      (theBoard[6].content === theBoard[7].content &&
        theBoard[6].content === theBoard[8].content &&
        theBoard[6].content !== null) ||
      //Check for r1/c1 - r2/c1 - r2/c1
      (theBoard[0].content === theBoard[3].content &&
        theBoard[0].content === theBoard[6].content &&
        theBoard[0].content !== null) ||
      //Check for r1/c2 - r2/c2 - r3/c2
      (theBoard[1].content === theBoard[4].content &&
        theBoard[1].content === theBoard[7].content &&
        theBoard[1].content !== null) ||
      //Check for r1/c3 - r2/c3 - r3/c3
      (theBoard[2].content === theBoard[5].content &&
        theBoard[2].content === theBoard[8].content &&
        theBoard[2].content !== null) ||
      //Check for r1/c1 - r2/c2 - r3/c3
      (theBoard[0].content === theBoard[4].content &&
        theBoard[0].content === theBoard[8].content &&
        theBoard[0].content !== null) ||
      //Check for r3/c1 - r2/c2 - r1/c3
      (theBoard[6].content === theBoard[4].content &&
        theBoard[6].content === theBoard[2].content &&
        theBoard[6].content !== null)
    ) {
      return true;
    }
  };

  return {
    theBoard,
    tokenCounter,
    placeToken,
    resetBoard,
    placeToken,
    checkBoardForWin,
  };
})();

const Player = (function () {
  let createdPlayers = 0;

  return function (name) {
    name;
    let token;
    let score = 0;
    if (createdPlayers === 0) {
      token = "X";
    } else if (createdPlayers === 1) {
      token = "O";
    }
    createdPlayers = 1;

    const getName = () => {
      return name;
    };

    const getToken = () => {
      return token;
    };

    const getScore = () => {
      return score;
    };

    const updateScore = () => {
      score++;
    };

    const resetScore = () => {
      score = 0;
    };

    const playerWins = () => {
      token++;
    };

    return {
      createdPlayers,
      getName,
      getToken,
      getScore,
      updateScore,
      resetScore,
      playerWins,
    };
  };
})();

const GameControl = (() => {
  let activePlayer;
  let inactivePlayer;
  let player1Starts = true;
  let scoreToWin = 3;

  const initializeNewRound = () => {
    Board.resetBoard();
    Player.createdPlayers = 0;
    // createPlayers("Mario", "Luigi");
    if (player1Starts === true) {
      setActivePlayer(player1);
    } else {
      setActivePlayer(player2);
    }
    setInactivePlayer();
  };

  const setActivePlayer = (player) => {
    activePlayer = player;
  };

  const getActivePlayer = () => {
    return activePlayer;
  };

  const setInactivePlayer = () => {
    if (activePlayer === player1) {
      inactivePlayer = player2;
    } else inactivePlayer = player1;
  };

  const getInactivePlayer = () => {
    return inactivePlayer;
  };

  const changeWhoStarts = () => {
    if (activePlayer === player1) {
      player1Starts = false;
    } else player1Starts = true;
  };

  const drawToken = (cellName) => {
    Board.placeToken(activePlayer.getToken(), cellName);
    if (Board.checkBoardForWin()) {
      playerWon();
    } else {
      setActivePlayer(inactivePlayer);
      setInactivePlayer();
    }
  };

  const playerWon = () => {
    changeWhoStarts();
    activePlayer.updateScore();
    if (activePlayer.getScore() === scoreToWin) {
      gameOver();
    } else {
      console.log(activePlayer.getName(), " won this round");
      initializeNewRound();
    }
  };

  const gameOver = () => {
    console.log(activePlayer.getName(), " won the game over ", inactivePlayer.getName());
    //Display winner and looser on website
    //Function with a button to start again by making players first, reset score, then initialize
    activePlayer.resetScore();
    inactivePlayer.resetScore();
  };

  const tieGame = () => {
    console.log("Round tied");
    //Display tie game message, then initialize
    initializeNewRound();
  };

  return {
    initializeNewRound,
    getActivePlayer,
    getInactivePlayer,
    drawToken,
    playerWon,
    gameOver,
    tieGame,
  };
})();

const UIControl = (() => {
  //#region DOM-queries
  const musicButton = document.querySelector("#music-button");
  const marioThemeButton = document.querySelector("#mario-theme-button");
  const messageArea = document.querySelector(".message-area");
  const messageHeading = document.querySelector(".message-heading");
  const messageButtonsArea = document.querySelector(".message-buttons-area");
  const cellButtons = document.querySelectorAll(".board-button");
  const infoBarHeading = document.querySelector(".info-bar-heading");
  const infoBarStatusArea = document.querySelector(".info-bar-status-area");
  const scoreGoalText = document.querySelector(".score-goal-text");
  const scoreGoalNumber = document.querySelector(".score-goal-number");
  const roundsPlayedText = document.querySelector(".rounds-played-text");
  const roundsPlayedNumber = document.querySelector(".rounds-played-number");
  const infoBarPlayer1Area = document.querySelector(".info-bar-player1-area");
  const infoBarPlayer1Heading = document.querySelector(".info-bar-player1-heading");
  const infoBarPlayer1Info = document.querySelector(".info-bar-player1-info");
  const infoBarPlayer1Img = document.querySelector(".info-bar-player1-img");
  const player1Img = document.querySelector("#player1-img");
  const infoBarPlayer2Area = document.querySelector(".info-bar-player2-area");
  const infoBarPlayer2Heading = document.querySelector(".info-bar-player2-heading");
  const infoBarPlayer2Info = document.querySelector(".info-bar-player2-info");
  const player2Img = document.querySelector("#player2-img");
  const colorButton = document.querySelector(".color-theme-change-button");
  const restartButton = document.querySelector("#restart-button");
  //#endregion

  const setUpNewGame = () => {};
    
  return {
    setUpNewGame,
    getHTMLelements,
  };
})();

// Make player1 and player2.   const player1 = Player("Mario"); etc.
// GameControl.initializeNewRound();
// GameControl.drawToken("r1c1");
