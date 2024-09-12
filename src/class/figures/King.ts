import { Colors } from "../Colors";
import blackFigure from "../../assets/images/king-b.png";
import whiteFigure from "../../assets/images/king-w.png";
import { Figure, FigureNames } from "../Figure.ts";
import { Cell } from "../Cell.ts";

export class King extends Figure {
  isFirstStep: boolean;
  map: any;
  constructor(color: Colors, cell: Cell) {
    // необходимо задействовать те же пропсы что и в родителе
    super(color, cell);
    // задаем отдельное изображение и имя в зависимости от цвета
    this.image = color === Colors.BLACK ? blackFigure : whiteFigure;
    this.name = FigureNames.KING;
    this.isFirstStep = true;
    this.map = [];
  }

  canMove(onCell: Cell): boolean {
    if (!super.canMove(onCell)) return false;

    // разница должна не превышать 1
    const dx = Math.abs(this.cell.x - onCell.x);
    const dy = Math.abs(this.cell.y - onCell.y);

    function nothingtoRookRight(thisCell: Cell) {
      const all = thisCell.board.cells.flat();
      const sorted = all.filter((cell) => {
        if (cell.figure?.color !== thisCell.figure?.color) {
          return (
            cell.figure?.canMove(
              thisCell.board.getCell(thisCell.x + 1, thisCell.y)
            ) ||
            cell.figure?.canMove(
              thisCell.board.getCell(thisCell.x + 2, thisCell.y)
            )
          );
        }
      });

      return sorted.length > 0;
    }
    function nothingtoRookLeft(thisCell: Cell) {
      const all = thisCell.board.cells.flat();
      const sorted = all.filter((cell) => {
        if (cell.figure?.color !== thisCell.figure?.color) {
          return (
            cell.figure?.canMove(
              thisCell.board.getCell(thisCell.x - 1, thisCell.y)
            ) ||
            cell.figure?.canMove(
              thisCell.board.getCell(thisCell.x - 2, thisCell.y)
            ) ||
            cell.figure?.canMove(
              thisCell.board.getCell(thisCell.x - 3, thisCell.y)
            )
          );
        }
      });

      return sorted.length > 0;
    }

    if (
      ((this.isFirstStep &&
        this.cell.setHorizontal(onCell) &&
        onCell.figure === null &&
        onCell.y === this.cell.y &&
        ((!nothingtoRookRight(this.cell) && onCell.x === this.cell.x + 2) ||
          (!nothingtoRookLeft(this.cell) && onCell.x === this.cell.x - 3)) &&
        this.cell.setHorizontal(
          this.cell.board.getCell(this.cell.x + 1, this.cell.y)
        )) ||
        (dx <= 1 && dy <= 1)) &&
      onCell.checkKingUnderAttack(this.cell, onCell)
    ) {
      return true;
    }

    return false;
  }
  moveFigure(onCell: Cell): void {
    super.moveFigure(onCell);
    // onCell.checkKingUnderAttack(onCell, this.cell);
  }
}
