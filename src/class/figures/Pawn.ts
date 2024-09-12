import { Colors } from "../Colors";
import blackFigure from "../../assets/images/pawns-b.png";
import whiteFigure from "../../assets/images/pawns-w.png";

import { Figure, FigureNames } from "../Figure.ts";
import { Cell } from "../Cell.ts";

export class Pawn extends Figure {
  firstStep: boolean = true;
  constructor(color: Colors, cell: Cell) {
    // необходимо задействовать те же пропсы что и в родителе
    super(color, cell);
    // задаем отдельное изображение и имя в зависимости от цвета
    this.image = color === Colors.BLACK ? blackFigure : whiteFigure;
    this.name = FigureNames.PAWN;
  }
  canMove(onCell: Cell): boolean {
    if (!super.canMove(onCell)) return false;
    const direction = this.cell.figure?.color === Colors.BLACK ? 1 : -1;
    const firstDirection = this.cell.figure?.color === Colors.BLACK ? 2 : -2;

    const firstNoFigure = this.cell.board.getCell(
      this.cell.x,
      this.cell.y + direction
    );

    if (
      ((this.cell.y + direction === onCell.y &&
        onCell.figure === null &&
        onCell.y === this.cell.y + direction) ||
        (onCell.figure === null &&
          firstNoFigure.figure === null &&
          this.firstStep &&
          onCell.y === this.cell.y + firstDirection)) &&
      this.cell.x === onCell.x &&
      onCell.checkKingUnderAttack(this.cell, onCell)
      // this.cell.board.getCell(onCell.x, onCell.y)
    )
      return true;

    if (
      onCell.y === this.cell.y + direction &&
      (onCell.x === this.cell.x + 1 || onCell.x === this.cell.x - 1) &&
      this.cell.isEnemy(onCell) &&
      onCell.checkKingUnderAttack(this.cell, onCell)
    )
      return true;

    return false;
  }
  moveFigure(onCell: Cell): void {
    super.moveFigure(onCell);
    this.firstStep = false;
  }
}

// import { Colors } from "../Colors";
// import blackFigure from "../../assets/images/pawns-b.png";
// import whiteFigure from "../../assets/images/pawns-w.png";

// import { Figure, FigureNames } from "../Figure.ts";
// import { Cell } from "../Cell.ts";

// export class Pawn extends Figure {
//   firstStep: boolean = true;

//   constructor(color: Colors, cell: Cell) {
//     super(color, cell);
//     this.image = color === Colors.BLACK ? blackFigure : whiteFigure;
//     this.name = FigureNames.PAWN;
//   }

//   canMove(onCell: Cell): boolean {
//     // Проверка, может ли фигура в принципе двигаться
//     if (!super.canMove(onCell)) return false;

//     // Определение направления движения пешки в зависимости от цвета
//     const direction = this.color === Colors.BLACK ? 1 : -1;
//     const firstStepDirection = this.color === Colors.BLACK ? 2 : -2;

//     // Клетка прямо перед пешкой
//     const oneStepForward = this.cell.board.getCell(
//       this.cell.x,
//       this.cell.y + direction
//     );

//     // Пешка может двигаться на одну клетку вперёд, если она пуста
//     if (
//       onCell.y === this.cell.y + direction &&
//       onCell.x === this.cell.x &&
//       onCell.figure === null &&
//       onCell.isEmpty()
//     ) {
//       return true;
//     }

//     // Пешка может двигаться на две клетки вперёд, если это её первый ход и обе клетки перед ней пусты
//     if (
//       this.firstStep &&
//       onCell.y === this.cell.y + firstStepDirection &&
//       onCell.x === this.cell.x &&
//       onCell.figure === null &&
//       onCell.isEmpty() &&
//       oneStepForward.isEmpty()
//     ) {
//       return true;
//     }

//     // Пешка может атаковать по диагонали, если на клетке находится фигура противника
//     if (
//       onCell.figure !== null &&
//       onCell.y === this.cell.y + direction &&
//       (onCell.x === this.cell.x + 1 || onCell.x === this.cell.x - 1) &&
//       this.cell.isEnemy(onCell)
//     ) {
//       return true;
//     }

//     return false;
//   }

//   // Когда пешка двигается, её первый ход становится завершённым
//   moveFigure(onCell: Cell): void {
//     super.moveFigure(onCell);
//     this.firstStep = false;
//   }
// }
