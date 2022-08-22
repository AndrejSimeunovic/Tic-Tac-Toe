const gameBoard = Array.from(document.querySelectorAll("[data-cell]"));
const modal = document.querySelector(".modal");
const overlay = document.querySelector("#overlay");
const deleteModalButton = document.querySelector(".restartButton");
const resultMessage = document.querySelector(".resultMessage");
const playersTurn = document.querySelector(".players-turn");
const viewGameButton = document.querySelectorAll('.restartButton')[1]
const winningLines = [
  [0, 1, 2],
  [0, 3, 6],
  [0, 4, 8],
  [1, 4, 7],
  [2, 4, 6],
  [2, 5, 8],
  [3, 4, 5],
  [6, 7, 8],
];

const board = (() => {
  let playersArray = [];
  let array = [];
  const getArray = () => array;
  const getplayersArray = () => playersArray;
  const updateBoard = () => {
    array = gameBoard.map((cell) => cell.innerText);
    console.log(array);
  };
  const displayBoard = (index) => {
    array.forEach((cell) => cell.innerText);
    checkWinner(index);
  };
  const hasPlayedX = () => {
    if (playersArray[playersArray.length - 1] === "X") {
      return true;
    }
  };

  const checkWinner = (index) => {
    let indexesList = getIndexes(index);
    let possibleWinnerList = checkPossibleOutcomes(indexesList);
    let winnerList = possibleWinnerList.map((el) => getPossibleWinners(el));
    declareWinner(winnerList, possibleWinnerList);
  };
  const getIndexes = (nbr) => {
    let arr = winningLines.filter((el) => el.includes(nbr));
    return arr;
  };
  const checkPossibleOutcomes = (indexesList) => {
    return indexesList.reduce((acc, item) => {
      let a = item.map((el) => array[el]);
      acc.push(a);
      return acc;
    }, []);
  };
  const getPossibleWinners = (square) => {
    if (square[0] === square[1] && square[0] === square[2]) {
      return true;
    } else {
      return false;
    }
  };
  const declareWinner = (arr, possibleWinnerList) => {
    if (arr.includes(true)) {
      let index = arr.indexOf(true);
      promptWinner(possibleWinnerList[index]);
      return;
    }
    if (array.length === 9 && !array.includes("")) {
      openModal("Draw");
    }
  };
  const promptWinner = (arr) => {
    if (arr.includes("X")) {
      openModal("X");
    } else if (arr.includes("O")) {
      openModal("O");
    }
  };
  const openModal = (type) => {
    modal.classList.add("active");
    overlay.classList.add("active");
    if (type === "Draw") {
      resultMessage.innerText = `it's a ${type}!`;
    } else {
      resultMessage.innerText = `${type} Wins!`;
    }

    deleteModalButton.addEventListener("click", restartGameFromModal);
    viewGameButton.addEventListener("click", restartGameFromScreen);
  };
  const restartGameFromModal = () => {
    closeModal();
    restart()
    addGameBoardEvent()
  };
  const restartGameFromScreen = () => {
    closeModal();
    removeGameBoardEvent()
    let btn = document.createElement('button')
    btn.classList.add('restart')
    btn.innerText = 'Restart'
    document.body.appendChild(btn)
    btn.addEventListener('click', restartScreen)
  };
  const removeGameBoardEvent = () => {
    gameBoard.forEach((cell) => {
      cell.removeEventListener("click", addType);
    });
  }
  const restartScreen = (e) => {
    restart()
    addGameBoardEvent()
    e.target.remove()
    
  }
  const restart = () => {
    array = [];
    deleteSigns();
    playersTurn.innerText = "players turn: X";
    
  }
  const deleteSigns = () => {
    gameBoard.forEach((el) => {
      el.innerText = "";
    });
  };
  const closeModal = () => {
    modal.classList.remove("active");
    overlay.classList.remove("active");
    
  };

  return {
    displayBoard,
    getArray,
    updateBoard,
    hasPlayedX,
    getplayersArray,
  };
})();

const Player = (type) => {
  const play = (index) => {
    changeTurn();
    gameBoard[index].innerText = type;
    board.getplayersArray().push(type);
  };
  const changeTurn = () => {
    if (type === "X") {
      playersTurn.innerText = "players turn: O";
      return;
    }
    playersTurn.innerText = "players turn: X";
  };
  return { play };
};

const playerX = Player("X");
const playerO = Player("O");

function addGameBoardEvent() {
  gameBoard.forEach((cell) => {
    cell.addEventListener("click", addType);
  });
}

addGameBoardEvent()



function addType(event) {
  if (event.target.innerText) return;
  let index = gameBoard.indexOf(event.target);
  if (board.getArray().length === 0) {
    playerX.play(index);
    board.updateBoard();
    board.displayBoard(index);
    return;
  }

  if (board.hasPlayedX()) {
    playerO.play(index);
  } else {
    playerX.play(index);
  }

  board.updateBoard();
  board.displayBoard(index);
}
