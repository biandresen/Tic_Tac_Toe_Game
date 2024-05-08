const Board = (() => {
  let tokenCounter = 0;
  let validTokenPlacement;
  let tiedGame;
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

  const setTiedGame = (status) => {
    tiedGame = status;
  };

  const getTiedGame = () => {
    return tiedGame;
  };

  const resetBoard = () => {
    tokenCounter = 0;
    for (let i = 0; i < 9; i++) {
      theBoard[i].content = null;
    }
    updateTokensOnBoard();
  };

  const setValidTokenPlacement = (state) => {
    if (state) validTokenPlacement = true;
    else validTokenPlacement = false;
  };

  const getValidTokenPlacement = () => {
    return validTokenPlacement;
  };

  const placeToken = (token, cellName) => {
    let index = theBoard.findIndex((cell) => cell.id === cellName);
    if (theBoard[index].content === null) {
      theBoard[index].content = token;
      tokenCounter++;
      UIControl.playAudio("tokenSound");
      setValidTokenPlacement(true);
      updateTokensOnBoard();
    } else setValidTokenPlacement(false);

    if (tokenCounter >= 9) {
      alert("tiedGame = true");
      setTiedGame(true);
    }
  };

  const updateTokensOnBoard = () => {
    for (i = 0; i < UIControl.boardButtons.length; i++) {
      UIControl.boardButtons[i].textContent = theBoard[i].content;
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
    setTiedGame,
    getTiedGame,
    setValidTokenPlacement,
    getValidTokenPlacement,
    updateTokensOnBoard,
    placeToken,
    resetBoard,
    checkBoardForWin,
  };
})();

const Player = (function () {
  let createdPlayers = 0;
  //Construct player objects (player1 and player2)
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

    return {
      createdPlayers,
      getName,
      getToken,
      getScore,
      updateScore,
    };
  };
})();

const GameControl = (() => {
  let activePlayer;
  let inactivePlayer;
  let player1Starts = true;
  let scoreToWin;
  let roundsPlayed = -1;
  let gameIsOver = false;
  let gameIsResetting = false;

  const getScoreToWin = () => {
    return scoreToWin;
  };

  const setScoreToWin = (number) => {
    scoreToWin = number;
  };

  const startNewRound = () => {
    UIControl.messageHeading.textContent = "Tic Tac Toe";
    UIControl.updatePlayerInfo();
    roundsPlayed++;
    UIControl.roundsPlayedText.textContent = "Rounds played: " + roundsPlayed;
    Board.resetBoard();
  };

  const setPlayerStatus = (player1, player2) => {
    if (player1Starts === true) {
      setActivePlayer(player1);
    } else {
      setActivePlayer(player2);
    }
    setInactivePlayer(player1, player2);
  };

  const setActivePlayer = (player) => {
    activePlayer = player;
    UIControl.messageParagraph.textContent = activePlayer.getName() + "'s turn";
  };

  const setInactivePlayer = (player1, player2) => {
    if (activePlayer === player1) {
      inactivePlayer = player2;
    } else inactivePlayer = player1;
  };

  const drawToken = (cellName) => {
    if (gameIsResetting) return;
    Board.placeToken(activePlayer.getToken(), cellName);
    if (Board.checkBoardForWin() && !Board.getTiedGame()) {
      playerWon();
    } else if (Board.getTiedGame()) {
      alert("tied game");
      GameControl.tieGame();
    } else if (Board.getValidTokenPlacement()) switchActiveInactivePlayer();
  };

  const switchActiveInactivePlayer = () => {
    let active = activePlayer;
    let inactive = inactivePlayer;
    setActivePlayer(inactivePlayer);
    setInactivePlayer(active, inactive);
  };

  const playerWon = () => {
    activePlayer.updateScore();
    if (activePlayer.getScore().toString() === getScoreToWin()) {
      return gameOver();
    } else {
      UIControl.playAudio("winSound");
      UIControl.messageHeading.textContent = activePlayer.getName() + " won this round";
      UIControl.messageParagraph.textContent = "";
      gameIsResetting = true;
      setTimeout(() => {
        gameIsResetting = false;
        startNewRound();
      }, 3000);
    }
    if (!gameIsOver) switchActiveInactivePlayer();
  };

  const gameOver = () => {
    gameIsOver = true;
    UIControl.stopAudio("marioThemeSong");
    UIControl.playAudio("victorySound");
    UIControl.messageHeading.textContent = activePlayer.getName() + " won!";
    UIControl.messageParagraph.textContent = "";

    //Delete buttons on the board in order to display the winner
    while (UIControl.board.firstChild) {
      UIControl.board.removeChild(UIControl.board.firstChild);
    }

    UIControl.infoBarArea.style.display = "none";
    UIControl.board.classList += " winning-board";
    UIControl.board.textContent = "CONGRATULATIONS!";
    UIControl.scoreBoard.style.display = "block";
    UIControl.scoreBoard.innerHTML = `${activePlayer.getName()}'s score: ${activePlayer.getScore()}<br>${inactivePlayer.getName()}'s score: ${inactivePlayer.getScore()}`;
    //Find the image of the character who won
    const characterWhoWon = UIControl.characters.find(
      (character) => character.getAttribute("alt") === activePlayer.getName()
    );

    UIControl.board.appendChild(characterWhoWon);
    newGameButton = document.createElement("button");
    newGameButton.classList = "button new-game-button";
    newGameButton.textContent = "NEW GAME";
    UIControl.messageParagraph.appendChild(newGameButton);

    newGameButton.addEventListener("click", () => {
      location.reload();
    });
  };

  const tieGame = () => {
    UIControl.playAudio("tieSound");
    UIControl.messageHeading.textContent = "Game tied!";
    Board.updateTokensOnBoard();
    gameIsResetting = true;
    setTimeout(() => {
      gameIsResetting = false;
      Board.setTiedGame(false);
      startNewRound();
    }, 3000);
  };

  return {
    roundsPlayed,
    activePlayer,
    inactivePlayer,
    getScoreToWin,
    setScoreToWin,
    setPlayerStatus,
    startNewRound,
    drawToken,
    playerWon,
    gameOver,
    tieGame,
  };
})();

const UIControl = (() => {
  //#region DOM-queries
  const board = document.querySelector(".board-area");
  const scoreBoard = document.querySelector(".score-board");
  const marioThemeButton = document.querySelector("#mario-theme-button");
  const tooltip = document.querySelector(".tooltip");
  const messageHeading = document.querySelector(".message-heading");
  const messageParagraph = document.querySelector(".message-paragraph");
  const boardButtons = document.querySelectorAll(".board-button");
  const gameTypeButtonArea = document.querySelector(".game-type-button-area");
  const gameTypeButtons = document.querySelectorAll(".game-type-button");
  const selectPlayerButton = document.querySelector("#select-player-button");
  const playButton = document.querySelector("#play-button");
  const infoBarArea = document.querySelector(".info-bar-area");
  const infoBarHeading = document.querySelector(".info-bar-heading");
  const infoBarParagraph = document.querySelector(".info-bar-paragraph");
  const scoreGoalText = document.querySelector(".score-goal-text");
  const roundsPlayedText = document.querySelector(".rounds-played-text");
  const infoBarPlayer1Heading = document.querySelector(".info-bar-player1-heading");
  const infoBarPlayer1Info = document.querySelector(".info-bar-player1-info");
  const infoBarPlayer1Img = document.querySelector(".info-bar-player1-img");
  const infoBarPlayer2Heading = document.querySelector(".info-bar-player2-heading");
  const infoBarPlayer2Info = document.querySelector(".info-bar-player2-info");
  const infoBarPlayer2Img = document.querySelector(".info-bar-player2-img");
  const colorButton = document.querySelector(".color-theme-change-button");
  const marioImg = document.createElement("img");
  const luigiImg = document.createElement("img");
  const peachImg = document.createElement("img");
  const bowserImg = document.createElement("img");
  //#endregion

  let player1Chosen = false;
  let player1;
  let player2;
  const characters = [marioImg, luigiImg, peachImg, bowserImg];

  colorButton.addEventListener("click", changeThemeColor);
  marioThemeButton.addEventListener("click", marioThemeToggle);

  function changeThemeColor() {
    const marioThemeIsDisabled = document.getElementById("mario-theme-stylesheet").disabled;
    if (marioThemeIsDisabled === false) return (tooltip.style.display = "block");

    const hue = parseInt(getComputedStyle(document.documentElement).getPropertyValue("--hue"));
    document.documentElement.style.setProperty("--hue", hue + 100);
    if (hue === 1700) document.documentElement.style.setProperty("--hue", 0);
  }

  function marioThemeToggle() {
    const marioThemeStylesheet = document.getElementById("mario-theme-stylesheet");
    marioThemeStylesheet.toggleAttribute("disabled");
    tooltip.style.display = "none";
  }

  const playAudio = (audioId) => {
    const audio = document.getElementById(audioId);
    audio.play();
    if (audioId === "Mario") audio.volume = 0.4;
    if (audioId === "selectPlayerSound") audio.volume = 0.6;
    if (audioId === "marioThemeSong") audio.volume = 0.4;
    if (audioId === "tokenSound") audio.volume = 0.5;
    if (audioId === "winSound") audio.volume = 0.5;
    if (audioId === "tieSound") audio.volume = 0.6;
  };

  const stopAudio = (audioId) => {
    const audio = document.getElementById(audioId);
    audio.pause();
  };

  const displayWelcomeMessage = () => {
    board.style.display = "none";
    infoBarArea.style.display = "none";
    gameTypeButtonArea.style.display = "none";
    playButton.style.display = "none";
    messageHeading.textContent = "Tic Tac Toe";
    messageParagraph.textContent = "Welcome!";
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
      playAudio("selectYourPlayerSound");
      playAudio("selectPlayerSound");
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
    playAudio(name);
    playerSelected(name);
  }

  const playerSelected = (chosenCharacter) => {
    if (player1Chosen === false) {
      //Create player1
      player1 = Player(chosenCharacter);
      scoreGoalText.textContent += player1.getName();
      removeSelectedCharacter(chosenCharacter);
    } else if (player1Chosen === true) {
      //Create player2
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
    messageHeading.textContent = "Choose Game Type";
    messageParagraph.textContent = "";
    infoBarHeading.textContent = "Players";
    infoBarParagraph.textContent = "";

    gameTypeButtons.forEach((button) => {
      button.addEventListener("click", (e) => {
        GameControl.setScoreToWin(e.target.getAttribute("data-number"));
        gameTypeButtonArea.style.display = "none";
        displayPlayButton();
      });
    });
  };

  const displayPlayButton = () => {
    messageHeading.textContent = "Ready to play?";
    playButton.style.display = "";
    playButton.addEventListener("click", () => {
      stopAudio("selectPlayerSound");
      playAudio("marioThemeSong");
      setUpGame();
    });
  };

  const setUpGame = () => {
    playButton.style.display = "none";
    board.style.display = "";
    messageHeading.textContent = "Tic Tac Toe";
    infoBarHeading.textContent = "Game in progress";
    scoreGoalText.textContent = "First to: " + GameControl.getScoreToWin() + " points";
    roundsPlayedText.textContent = "Rounds played: " + GameControl.roundsPlayed;
    infoBarPlayer1Heading.textContent = "Player1";
    updatePlayerInfo();

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

    UIControl.addEventsForCells();
    GameControl.setPlayerStatus(player1, player2);
    GameControl.startNewRound();
  };

  const updatePlayerInfo = () => {
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
  };

  const addEventsForCells = () => {
    const cellNames = ["r1c1", "r1c2", "r1c3", "r2c1", "r2c2", "r2c3", "r3c1", "r3c2", "r3c3"];
    for (i = 0; i < cellNames.length; i++) {
      boardButtons[i].addEventListener("click", GameControl.drawToken.bind(null, cellNames[i]));
    }
  };

  return {
    characters,
    player1,
    player2,
    boardButtons,
    roundsPlayedText,
    messageHeading,
    messageParagraph,
    board,
    infoBarArea,
    scoreBoard,
    playButton,
    playAudio,
    stopAudio,
    updatePlayerInfo,
    addEventsForCells,
    displayWelcomeMessage,
  };
})();

UIControl.displayWelcomeMessage();
