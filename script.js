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


