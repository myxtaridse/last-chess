import React from "react";
import { Board } from "../class/Board";
import CellRender from "./CellRender";
import { Cell } from "../class/Cell.ts";
import { Player } from "../class/Player.ts";
import { Colors } from "../class/Colors.ts";

interface BoardRenderProps {
  board: Board;
  setBoard: (board: Board) => void;
  swapPlayer: () => void;
  currentPlayer: Player | null;

  setIsEnd: (isEnd: boolean) => void;
  prevCell: Cell | null;
  setPrevCell: (prevCell: any) => void;
  nowCell: Cell | null;
  setNowCell: (prevCell: any) => void;
}

const BoardRender: React.FC<BoardRenderProps> = ({
  board,
  setBoard,
  swapPlayer,
  currentPlayer,
  setIsEnd,
  prevCell,
  setPrevCell,
  nowCell,
  setNowCell,
}) => {
  const [selectedCell, setSelectedCell] = React.useState<Cell | null>(null);

  // для выбора ячейки
  const selectClick = (cell: Cell) => {
    if (
      selectedCell && // если выбрана ячейка
      selectedCell !== cell && // если там нет фигуры
      selectedCell.figure?.canMove(cell) // фигура может ходить
    ) {
      selectedCell.moveFigure(cell); // перетаскиваем фигуру
      swapPlayer();
      setSelectedCell(null); // обнуляем выбранную клетку
      updateBoard(); // обновляем вид доски из начального состояния
    } else {
      if (cell.figure?.color === currentPlayer?.color) {
        setSelectedCell(cell); // выбираем клетку
      }
    }
  };
  const updateBoard = () => {
    const newBoard = board.getCopyBoard();
    setBoard(newBoard);
  };
  const highlightCells = () => {
    board.highlightCells(selectedCell);
    updateBoard();
  };
  React.useEffect(() => {
    highlightCells();
  }, [selectedCell]);
  return (
    <div
      className={[
        "board",
        currentPlayer?.color === Colors.BLACK ? "transformBoard" : "",
      ].join(" ")}
    >
      {board.cells.map((row, i) => (
        <React.Fragment key={i}>
          {row.map((cell) => (
            <CellRender
              key={cell.id}
              cell={cell}
              // данное свойство изменяет цвет выбранной ячейки
              selected={
                cell.x === selectedCell?.x && cell.y === selectedCell?.y
              }
              click={selectClick}
              currentPlayer={currentPlayer}
              setIsEnd={setIsEnd}
              prevCell={prevCell}
              setPrevCell={setPrevCell}
              nowCell={nowCell}
              setNowCell={setNowCell}
            />
          ))}
        </React.Fragment>
      ))}
    </div>
  );
};

export default BoardRender;
