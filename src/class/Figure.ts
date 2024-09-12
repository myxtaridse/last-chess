import { Colors } from "./Colors.ts";
import image from "../../assets/images/elephant-b.png";
import { Cell } from "./Cell.ts";

// выделяем разные фигуры
export enum FigureNames {
  FIGURE = "фигура",
  QUEEN = "королева",
  KING = "король",
  PAWN = "пешка",
  KNIGHT = "конь",
  ROOK = "ладья",
  ELEPHANT = "слон",
}

// добавляем уровень для каждой фигуры
export enum FigureXP {
  FIGURE = 0,
  QUEEN = 9,
  KING = 0,
  PAWN = 1,
  KNIGHT = 3,
  ROOK = 5,
  ELEPHANT = 3,
}

// для фигуры нужен цвет, само изображение фигуры, ячейка с координатами, наименование ее, айди
export class Figure {
  color: Colors;
  image: typeof image | null;
  cell: Cell;
  name: FigureNames;
  id: number;
  isFirstStep: boolean;
  can: boolean;
  isKingUnderAttack: Cell;

  // едино для всех фигур
  constructor(color: Colors, cell: Cell) {
    this.color = color;
    this.cell = cell;
    this.cell.figure = this;
    this.image = null;
    this.name = FigureNames.FIGURE;
    this.id = Math.random();
    this.isFirstStep = false;
    this.can = true;
    this.isKingUnderAttack = cell;
  }
  canMove(onCell: Cell): boolean {

    if (onCell.figure?.color !== this.cell.figure?.color) return true;

    return false;
  }

  moveFigure(onCell: Cell) {

    // this.cell.goOnAttack(this.cell, this.isKingUnderAttack, onCell);
    if (this.color === Colors.WHITE) {
      onCell.board.moveWhite.push(onCell.position);
    } else if (this.color === Colors.BLACK) {
      onCell.board.moveBlack.push(onCell.position);
    }
  }
}
