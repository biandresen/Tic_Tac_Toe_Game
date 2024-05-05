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
  let scoreToWin;
  let roundsPlayed = 0;

  const initializeNewRound = () => {
    roundsPlayed++;
    Board.resetBoard();
    Player.createdPlayers = 0;
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
    scoreToWin,
    roundsPlayed,
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
  const board = document.querySelector(".board-area");
  const musicButton = document.querySelector("#music-button");
  const marioThemeButton = document.querySelector("#mario-theme-button");
  const messageArea = document.querySelector(".message-area");
  const messageHeading = document.querySelector(".message-heading");
  const messageParagraph = document.querySelector(".message-paragraph");
  const messageButtonsArea = document.querySelector(".message-buttons-area");
  const cellButtons = document.querySelectorAll(".board-button");
  const battlingCharacters = document.querySelector(".battling-characters");
  const gameTypeButtonArea = document.querySelector(".game-type-button-area");
  const gameTypeButtons = document.querySelectorAll(".game-type-button");
  const selectPlayerButton = document.querySelector("#select-player-button");
  const playButton = document.querySelector("#play-button");
  const infoBarArea = document.querySelector(".info-bar-area");
  const infoBarHeading = document.querySelector(".info-bar-heading");
  const infoBarParagraphArea = document.querySelector(".info-bar-paragraph-area");
  const infoBarParagraph = document.querySelector(".info-bar-paragraph");
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
  const infoBarPlayer2Img = document.querySelector(".info-bar-player2-img");
  const player2Img = document.querySelector("#player2-img");
  const colorButton = document.querySelector(".color-theme-change-button");
  const restartButton = document.querySelector("#restart-button");
  const marioImg = document.createElement("img");
  const luigiImg = document.createElement("img");
  const peachImg = document.createElement("img");
  const bowserImg = document.createElement("img");
  //#endregion

  let player1Chosen = false;
  let player1;
  let player2;
  const characters = [marioImg, luigiImg, peachImg, bowserImg];

  const displayWelcomeMessage = () => {
    board.style.display = "none";
    infoBarArea.style.display = "none";
    gameTypeButtonArea.style.display = "none";
    playButton.style.display = "none";
    restartButton.style.display = "none";
    messageHeading.textContent = "WELCOME!";
    messageParagraph.textContent = "Tic Tac Toe";
    infoBarHeading.textContent = "New Game";
    infoBarParagraph.textContent = "Select your player";
    scoreGoalText.textContent = "Player1: ";
    roundsPlayedText.textContent = "Player2: ";
    marioImg.src = "./img/mario.png";
    luigiImg.src = "./img/luigi.png";
    peachImg.src = "./img/peach.png";
    bowserImg.src = "./img/bowser.png";
    marioImg.classList = "mario-img character-img";
    luigiImg.classList = "luigi-img character-img";
    peachImg.classList = "peach-img character-img";
    bowserImg.classList = "bowser-img character-img";
    marioImg.setAttribute("alt", "Mario");
    luigiImg.setAttribute("alt", "Luigi");
    peachImg.setAttribute("alt", "Peach");
    bowserImg.setAttribute("alt", "Bowser");
    infoBarPlayer1Heading.appendChild(marioImg);
    infoBarPlayer2Heading.appendChild(luigiImg);
    infoBarPlayer1Img.appendChild(peachImg);
    infoBarPlayer2Img.appendChild(bowserImg);

    selectPlayerButton.addEventListener("click", () => {
      selectYourPlayer();
    });
  };

  const selectYourPlayer = () => {
    selectPlayerButton.style.display = "none";
    infoBarArea.style.display = "";
    enableCharacterEventListeners();
  };

  const enableCharacterEventListeners = () => {
    marioImg.addEventListener("click", handleCharacterClickEvent.bind(null, "Mario"), {
      once: true,
    });
    luigiImg.addEventListener("click", handleCharacterClickEvent.bind(null, "Luigi"), {
      once: true,
    });
    peachImg.addEventListener("click", handleCharacterClickEvent.bind(null, "Peach"), {
      once: true,
    });
    bowserImg.addEventListener("click", handleCharacterClickEvent.bind(null, "Bowser"), {
      once: true,
    });
  };

  function handleCharacterClickEvent(name) {
    playerSelected(name);
  }

  const playerSelected = (chosenCharacter) => {
    if (player1Chosen === false) {
      player1 = Player(chosenCharacter);
      scoreGoalText.textContent += player1.getName();
      removeSelectedCharacter(chosenCharacter);
    } else if (player1Chosen === true) {
      player2 = Player(chosenCharacter);
      roundsPlayedText.textContent += player2.getName();
      removeCharacters();
      chooseGameType();
    }
    player1Chosen = true;
  };

  const removeSelectedCharacter = (chosenCharacter) => {
    for (i = 0; i < characters.length; i++) {
      if (characters[i].getAttribute("alt") === chosenCharacter) {
        characters[i].style.display = "none";
      }
    }
  };

  const removeCharacters = () => {
    for (i = 0; i < characters.length; i++) {
      characters[i].style.display = "none";
    }
  };

  const chooseGameType = () => {
    gameTypeButtonArea.style.display = "";
    messageHeading.textContent = "";
    messageParagraph.textContent = "Choose game type ";
    infoBarHeading.textContent = "Players:";
    infoBarParagraph.textContent = "";
    gameTypeButtons.forEach((button) => {
      button.addEventListener("click", (e) => {
        GameControl.scoreToWin = e.target.getAttribute("data-number");
        gameTypeButtonArea.style.display = "none";
        displayPlayButton();
      });
    });
  };

  const displayPlayButton = () => {
    messageParagraph.textContent = "Ready to play?";
    playButton.style.display = "";
    playButton.addEventListener("click", () => {
      setUpGame();
    });
  };

  const setUpGame = () => {
    playButton.style.display = "none";
    board.style.display = "";
    messageParagraph.textContent = "Tic Tac Toe";
    restartButton.style.display = "none";
    infoBarHeading.textContent = "Game in progress";
    scoreGoalText.textContent = "First to: " + GameControl.scoreToWin + " points";
    roundsPlayedText.textContent = "Rounds played: " + GameControl.roundsPlayed;
    infoBarPlayer1Heading.textContent = "Player1";
    infoBarPlayer1Info.innerHTML =
      "Name: " +
      player1.getName() +
      "<br>Token: " +
      player1.getToken() +
      "<br>Score: " +
      player1.getScore();
    infoBarPlayer2Heading.textContent = "Player2";
    infoBarPlayer2Info.innerHTML =
      "Name: " +
      player2.getName() +
      "<br>Token: " +
      player2.getToken() +
      "<br>Score: " +
      player2.getScore();

    let player1Character = characters.find(
      (character) => character.getAttribute("alt") === player1.getName()
    );
    player1Character.style.display = "";
    infoBarPlayer1Img.appendChild(player1Character);

    let player2Character = characters.find(
      (character) => character.getAttribute("alt") === player2.getName()
    );
    player2Character.style.display = "";
    infoBarPlayer2Img.appendChild(player2Character);
  };

  return {
    characters,
    displayWelcomeMessage,
  };
})();

UIControl.displayWelcomeMessage();

// Make player1 and player2.   const player1 = Player("Mario"); etc.
// GameControl.initializeNewRound();
// GameControl.drawToken("r1c1");
