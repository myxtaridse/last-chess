import React from "react";
import "./styles/All.css";
import { Board } from "./class/Board";
import BoardRender from "./components/BoardRender";
import Logo from "./components/Logo";
import Footer from "./components/Footer";
import { Player } from "./class/Player";
import { Colors } from "./class/Colors";
import Direction from "./components/Direction";
import ModalWindow from "./components/ModalWindow";
import ModalEnd from "./components/ModalEnd";
import { Cell } from "./class/Cell";

function App() {
  const [board, setBoard] = React.useState(new Board());
  const [currentPlayer, setCurrentPlayer] = React.useState<Player | null>(null);
  // const [whitePlayer, setWhitePlayer] = React.useState<Player | null>(
  //   new Player(Colors.WHITE)
  // );
  // const [blackPlayer, setBlackPlayer] = React.useState<Player | null>(
  //   new Player(Colors.BLACK)
  // );

  const [prevCell, setPrevCell] = React.useState<Cell | null>(null);
  const [nowCell, setNowCell] = React.useState<Cell | null>(null);

  const [isGame, setIsGame] = React.useState(false);
  const [isEnd, setIsEnd] = React.useState(false);

  const [secW, setSecW] = React.useState(0);
  const [secB, setSecB] = React.useState(0);
  const [minW, setMinW] = React.useState(0);
  const [minB, setMinB] = React.useState(0);
  const timerId = React.useRef<number>();

  React.useEffect(() => {
    if (board.isEnd) {
      setIsEnd(true);
    }
  }, [board]);

  React.useEffect(() => {
    if (isGame) {
      timerId.current = setInterval(() => {
        if (currentPlayer?.color === Colors.WHITE) {
          if (secW === 0) {
            setMinW((prev) => prev - 1);
            setSecW(59);
          } else {
            setSecW((prev) => prev - 1);
          }
        } else if (currentPlayer?.color === Colors.BLACK) {
          if (secB === 0) {
            setMinB((prev) => prev - 1);
            setSecB(59);
          } else {
            setSecB((prev) => prev - 1);
          }
        }
      }, 1000);
    }
    return () => clearInterval(timerId.current);
  }, [isGame, secW, secB, minB, minW, currentPlayer]);

  function swapPlayer() {
    setCurrentPlayer(
      currentPlayer?.color === Colors.BLACK
        ? board.whitePlayer
        : board.blackPlayer
    );
  }

  React.useEffect(() => {
    if (isGame && (minB < 0 || minW < 0)) {
      setIsEnd(true);
    }
  }, [isGame, minB, minW]);

  const restart = () => {
    const newBoard = new Board();
    newBoard.initCells();
    newBoard.addFigure();
    setBoard(newBoard);
  };
  React.useEffect(() => {
    restart();
    setCurrentPlayer(board.whitePlayer);
  }, []);

  return (
    <>
      <div className="app">
        <Logo />
        <BoardRender
          board={board}
          setBoard={setBoard}
          currentPlayer={currentPlayer}
          swapPlayer={swapPlayer}
          setIsEnd={setIsEnd}
          prevCell={prevCell}
          setPrevCell={setPrevCell}
          nowCell={nowCell}
          setNowCell={setNowCell}
        />
        <Direction
          playerColor={
            currentPlayer === board.blackPlayer
              ? board.whitePlayer
              : board.blackPlayer
          }
          board={board}
          currentPlayer={currentPlayer}
          timer={currentPlayer === board.blackPlayer ? minW : minB}
          sec={currentPlayer === board.blackPlayer ? secW : secB}
        />
        <Direction
          playerColor={currentPlayer}
          board={board}
          currentPlayer={currentPlayer}
          timer={currentPlayer === board.blackPlayer ? minB : minW}
          sec={currentPlayer === board.blackPlayer ? secB : secW}
        />
        <Footer />
        {!board.isGame && !board.isEnd && (
          <ModalWindow
            isGame={isGame}
            setIsGame={setIsGame}
            setBlackTimer={setMinB}
            setWhiteTimer={setMinW}
            timer={minW}
          />
        )}
        {isEnd && (
          <ModalEnd
            isEnd={isEnd}
            currentPlayer={
              currentPlayer === board.blackPlayer
                ? board.whitePlayer
                : board.blackPlayer
            }
          />
        )}
      </div>
    </>
  );
}

export default App;
