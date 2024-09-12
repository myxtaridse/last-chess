import { Colors } from "../Colors";
import blackFigure from "../../assets/images/elephant-b.png";
import whiteFigure from "../../assets/images/elephant-w.png";
import { Figure, FigureNames } from "../Figure.ts";
import { Cell } from "../Cell.ts";

export class Elephant extends Figure {
  constructor(color: Colors, cell: Cell) {
    // необходимо задействовать те же пропсы что и в родителе
    super(color, cell);
    // задаем отдельное изображение и имя в зависимости от цвета
    this.image = color === Colors.BLACK ? blackFigure : whiteFigure;
    this.name = FigureNames.ELEPHANT;
  }
  canMove(onCell: Cell): boolean {
    if (!super.canMove(onCell)) return false;

    if (
      this.cell.setDiagonal(onCell) &&
      onCell.checkKingUnderAttack(this.cell, onCell)
    )
      return true;

    return false;
  }
}
