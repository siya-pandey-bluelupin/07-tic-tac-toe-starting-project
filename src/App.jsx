import { useEffect, useState } from "react";
import GameBoard from "./components/GameBoard";
import Player from "./components/Player";
import Log from "./components/Log";
import { WINNING_COMBINATIONS } from "./winning-combinations";
import GameOver from "./components/GameOver";
import { getAIMove } from "./utils/ai";

const PLAYERS = {
  X: "Player 1",
  O: "Player 2",
};
const INITIAL_GAME_BOARD = [
  [null, null, null],
  [null, null, null],
  [null, null, null],
];
function deriveActivePlayer(gameTurns) {
  // let currentPlayer = "X";
  // if (gameTurns.length > 0 && gameTurns[0].player === "X") {
  //   currentPlayer = "O";
  // }
  // return currentPlayer;
  return gameTurns.length % 2 === 0 ? "X" : "O";
}

function deriveGameBoard(gameTurns) {
  let gameBoard = [...INITIAL_GAME_BOARD.map((array) => [...array])];

  for (const turn of gameTurns) {
    const { square, player } = turn;
    const { row, col } = square;
    gameBoard[row][col] = player;
  }
  return gameBoard;
}
function deriveWinner(gameBoard, players) {
  let winner = null;

  for (const combination of WINNING_COMBINATIONS) {
    const firstSquareSymbol =
      gameBoard[combination[0].row][combination[0].column];
    const secondSquareSymbol =
      gameBoard[combination[1].row][combination[1].column];
    const thirdSquareSymbol =
      gameBoard[combination[2].row][combination[2].column];
    if (
      firstSquareSymbol &&
      firstSquareSymbol === secondSquareSymbol &&
      firstSquareSymbol === thirdSquareSymbol
    ) {
      winner = players[firstSquareSymbol];
    }
  }
  return winner;
}

function App() {
  const [players, setPlayers] = useState(PLAYERS);
  const [gameTurns, setGameTurns] = useState([]);
  const [mode, setMode] = useState(null);
  const [showChoice, setShowChoice] = useState(true);
  const activePlayer = deriveActivePlayer(gameTurns);
  const gameBoard = deriveGameBoard(gameTurns);

  const winner = deriveWinner(gameBoard, players);
  const hasDraw = gameTurns.length === 9 && !winner;
  function handlePlayerNameChange(symbol, newName) {
    setPlayers((prevPlayers) => {
      return {
        ...prevPlayers,
        [symbol]: newName,
      };
    });
  }
  // const handleSelectSquare = (rowIndex, colIndex) => {
  //   if (winner || hasDraw ||gameBoard[rowIndex][colIndex]!==null) return;
    
  //   setGameTurns((prevTurns) => {
  //     const currentPlayer = deriveActivePlayer(prevTurns);
  //     const updatedTurns = [
  //       {
  //         square: { row: rowIndex, col: colIndex },
  //         player: currentPlayer,
  //       },
  //       ...prevTurns,
  //     ];
  //     if (mode === "AI" && currentPlayer === "X") {
  //       const aiMove = getAIMove(deriveGameBoard(updatedTurns));
  //       if (aiMove) {
  //         updatedTurns.push({ square: aiMove, player: "O" });
  //       }
  //     }
  //     return updatedTurns;
  //   });
  // };
  const handleSelectSquare = (rowIndex, colIndex) => {
    if (winner || hasDraw || gameBoard[rowIndex][colIndex] !== null) return;

    setGameTurns((prevTurns) => {
      const updatedTurns = [
        ...prevTurns,
        { square: { row: rowIndex, col: colIndex }, player: "X" },
      ];

      if (mode === "AI") {
        setTimeout(() => {
          const aiMove = getAIMove(deriveGameBoard(updatedTurns));
          if (aiMove) {
            setGameTurns((turns) => [
              ...turns,
              { square: aiMove, player: "O" },
            ]);
          }
        }, 1000); // AI waits for 1 second before making a move
      }

      return updatedTurns;
    });
  };


  function handleRestart() {
    setGameTurns([]);
    setShowChoice(true);
  }
  const handleSelectMode = (selectedMode) => {
    setMode(selectedMode);
    setShowChoice(false);
  };

  return (
    <main>
      
        {showChoice && (
          <div id="game-over" style={{ gap: 50 }}>
            <button onClick={() => handleSelectMode("AI")}>Play with AI</button>
            <button onClick={() => handleSelectMode("2P")}>
              Play with Player 2
            </button>
          </div>
        )}

        {!showChoice && (

          <>
          <div id="game-container">
           <ol id="players" className="highlight-player">
          <Player
            initialName={PLAYERS.X}
            symbol="X"
            isActive={activePlayer === "X"}
            onChangeName={handlePlayerNameChange}
          />
          <Player
            initialName={PLAYERS.O}
            symbol="O"
            isActive={activePlayer === "O"}
            onChangeName={handlePlayerNameChange}
          />
        </ol>
        {(winner || hasDraw) && (
          <GameOver winner={winner} onRestart={handleRestart} />
        )}
        <GameBoard onSelectSquare={handleSelectSquare} board={gameBoard} />{" "}
     
      <Log turns={gameTurns} />
      </div>{" "}
          </>
        )}
      
    </main>
  );
}

export default App;
