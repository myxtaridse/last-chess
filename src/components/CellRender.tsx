import React from "react";

import { Colors } from "../class/Colors";
import { Cell } from "../class/Cell.ts";
import { Player } from "../class/Player.ts";

interface CellRenderProps {
  cell: Cell;
  selected: boolean;
  click: (cell: Cell) => void;
  currentPlayer: Player | null;
  setIsEnd: (isEnd: boolean) => void;
  prevCell: Cell | null;
  setPrevCell: (prevCell: any) => void;
  nowCell: Cell | null;
  setNowCell: (prevCell: any) => void;
}

const CellRender: React.FC<CellRenderProps> = React.memo(
  ({
    cell,
    selected,
    click,
    currentPlayer,
    setIsEnd,
    prevCell,
    setPrevCell,
    nowCell,
    setNowCell,
  }) => {
    React.useEffect(() => {
      if (cell.board.prevCell !== null) {
        setPrevCell(cell.board.prevCell);
      }
      if (cell.board.nowCell !== null) {
        setNowCell(cell.board.nowCell);
      }
    }, [cell.board.prevCell, cell.board.nowCell]);

    return (
      <div
        onClick={() => {
          click(cell);

          if (cell.board.isEnd) {
            setIsEnd(true);
            console.log(currentPlayer);
          }
        }}
        className={[
          "cell",
          cell.color === Colors.BLACK ? "cell-b" : "cell-w",
          selected ? "selected" : "",
          cell === prevCell
            ? prevCell.color === Colors.BLACK
              ? "prev-cell"
              : "now-cell"
            : cell.color === Colors.BLACK
            ? "cell-b"
            : "cell-w",
          cell.figure?.cell === nowCell
            ? nowCell.color === Colors.BLACK
              ? "prev-cell"
              : "now-cell"
            : cell.color === Colors.BLACK
            ? "cell-b"
            : "cell-w",
        ].join(" ")}
      >
        {cell.available && !cell.figure && <div className={"available"}></div>}
        {cell.available && cell.figure && (
          <div className={"availableFigure"}></div>
        )}
        {cell.figure?.image && (
          <img
            className={[
              currentPlayer?.color === Colors.BLACK ? "transformBoard" : "",
            ].join(" ")}
            src={cell.figure.image}
            alt="figure"
            draggable="false"
          />
        )}
      </div>
    );
  }
);
// один див - разные классы
export default CellRender;
