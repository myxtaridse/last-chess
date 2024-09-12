import { Colors } from "../Colors";
import blackFigure from "../../assets/images/knight-b.png";
import whiteFigure from "../../assets/images/knight-w.png";
import { Figure, FigureNames } from "../Figure.ts";
import { Cell } from "../Cell.ts";

export class Knight extends Figure {
  constructor(color: Colors, cell: Cell) {
    // необходимо задействовать те же пропсы что и в родителе
    super(color, cell);
    // задаем отдельное изображение и имя в зависимости от цвета
    this.image = color === Colors.BLACK ? blackFigure : whiteFigure;
    this.name = FigureNames.KNIGHT;
  }
  canMove(onCell: Cell): boolean {
    if (!super.canMove(onCell)) return false;
    const dx = Math.abs(this.cell.x - onCell.x); // например, начальное значение - (x-2)(y-5)
    const dy = Math.abs(this.cell.y - onCell.y);
    // если вычитать из начального значения походку г, то разница будет в 1 или 2
    // x-(2-0) y-(5-6) -> 2 && 1
    if (
      ((dx === 1 && dy === 2) || (dx === 2 && dy === 1)) &&
      onCell.checkKingUnderAttack(this.cell, onCell)
    )
      return true; // разница всегда в 1 или 2 в x и y

    return false;
  }
}
