// src/utils/ai.js
function isMovesLeft(board) {
    for (let i = 0; i < board.length; i++) {
      for (let j = 0; j < board[i].length; j++) {
        if (board[i][j] === null) {
          return true;
        }
      }
    }
    return false;
  }
  
  function evaluate(board) {
    // Check rows for victory
    for (let row = 0; row < board.length; row++) {
      if (board[row][0] === board[row][1] && board[row][1] === board[row][2]) {
        if (board[row][0] === "O") return +10;
        else if (board[row][0] === "X") return -10;
      }
    }
  
    // Check columns for victory
    for (let col = 0; col < board[0].length; col++) {
      if (board[0][col] === board[1][col] && board[1][col] === board[2][col]) {
        if (board[0][col] === "O") return +10;
        else if (board[0][col] === "X") return -10;
      }
    }
  
    // Check diagonals for victory
    if (board[0][0] === board[1][1] && board[1][1] === board[2][2]) {
      if (board[0][0] === "O") return +10;
      else if (board[0][0] === "X") return -10;
    }
  
    if (board[0][2] === board[1][1] && board[1][1] === board[2][0]) {
      if (board[0][2] === "O") return +10;
      else if (board[0][2] === "X") return -10;
    }
  
    // No one has won
    return 0;
  }
  
  function minimax(board, depth, isMax) {
    let score = evaluate(board);
  
    // If Maximizer has won the game, return evaluated score
    if (score === 10) return score - depth;
  
    // If Minimizer has won the game, return evaluated score
    if (score === -10) return score + depth;
  
    // If there are no more moves and no winner, it's a tie
    if (!isMovesLeft(board)) return 0;
  
    // If this is maximizer's move
    if (isMax) {
      let best = -1000;
  
      // Traverse all cells
      for (let i = 0; i < board.length; i++) {
        for (let j = 0; j < board[i].length; j++) {
          // Check if cell is empty
          if (board[i][j] === null) {
            // Make the move
            board[i][j] = "O";
  
            // Call minimax recursively and choose the maximum value
            best = Math.max(best, minimax(board, depth + 1, !isMax));
  
            // Undo the move
            board[i][j] = null;
          }
        }
      }
      return best;
    } else {
      // If this is minimizer's move
      let best = 1000;
  
      // Traverse all cells
      for (let i = 0; i < board.length; i++) {
        for (let j = 0; j < board[i].length; j++) {
          // Check if cell is empty
          if (board[i][j] === null) {
            // Make the move
            board[i][j] = "X";
  
            // Call minimax recursively and choose the minimum value
            best = Math.min(best, minimax(board, depth + 1, !isMax));
  
            // Undo the move
            board[i][j] = null;
          }
        }
      }
      return best;
    }
  }
  
  export function getAIMove(gameBoard) {
    let bestVal = -1000;
    let bestMove = null;
  
    // Traverse all cells, evaluate minimax function for all empty cells, and return the cell with optimal value
    for (let i = 0; i < gameBoard.length; i++) {
      for (let j = 0; j < gameBoard[i].length; j++) {
        // Check if cell is empty
        if (gameBoard[i][j] === null) {
          // Make the move
          gameBoard[i][j] = "O";
  
          // Compute evaluation function for this move
          let moveVal = minimax(gameBoard, 0, false);
  
          // Undo the move
          gameBoard[i][j] = null;
  
          // If the value of the current move is more than the best value, update best
          if (moveVal > bestVal) {
            bestMove = { row: i, col: j };
            bestVal = moveVal;
          }
        }
      }
    }
  
    return bestMove;
  }