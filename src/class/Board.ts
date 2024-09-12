import { Colors } from "./Colors";

import { Elephant } from "./figures/Elephant";
import { Rook } from "./figures/Rook";
import { Knight } from "./figures/Knight";
import { Queen } from "./figures/Queen";
import { King } from "./figures/King";
import { Pawn } from "./figures/Pawn";
import { Cell } from "./Cell.ts";
import { Figure } from "./Figure.ts";

const vertical = ["1", "2", "3", "4", "5", "6", "7", "8"];
const horizontal = ["a", "b", "c", "d", "e", "f", "g", "h"];

export class Board {
  // Создаем массив для сохранения туда всех ячеек
  cells: Cell[][] = []; // представляет из себя двумерный массив, содержащий и строки столбцы
  lostWhiteFugure: Figure[] = [];
  lostBlackFugure: Figure[] = [];
  moveWhite: string[] = [];
  moveBlack: string[] = [];
  castling: boolean = false;
  isAttack: boolean = true;
  isGame: boolean = false;
  isEnd: boolean = false;
  prevCell: Cell | null = null;
  nowCell: Cell | null = null;

  public initCells() {
    // Пробегаемся по массиву, добавляя туда и строки и столбцы с разными цветами
    for (let i = 0; i < 8; i++) {
      const row: Cell[] = [];
      for (let j = 0; j < 8; j++) {
        if ((j + i) % 2 !== 0) {
          // идет отдельное сохранение ячеек для разного цвета
          row.push(
            new Cell(this, j, i, Colors.BLACK, null, vertical[i], horizontal[j])
          );
        } else {
          row.push(
            new Cell(this, j, i, Colors.WHITE, null, vertical[i], horizontal[j])
          );
        }
      }
      this.cells.push(row);
    }
  }

  public getCopyBoard(): Board {
    const newBoard = new Board();
    newBoard.cells = this.cells;
    newBoard.lostWhiteFugure = this.lostWhiteFugure;
    newBoard.lostBlackFugure = this.lostBlackFugure;
    newBoard.moveBlack = this.moveBlack;
    newBoard.moveWhite = this.moveWhite;
    return newBoard;
  }

  // пройдемся по всем ячейкам доски
  // selectedCell - выбранная ячейка
  public highlightCells(selectedCell: Cell | null) {
    for (let i = 0; i < this.cells.length; i++) {
      const row = this.cells[i]; // представляет из себя массив по 8 элементов, в купе все клетки с фигурами и другими свойствами
      for (let j = 0; j < row.length; j++) {
        const onCell = row[j]; // отдельные клетки с такими же свойствами
        onCell.available = !!selectedCell?.figure?.canMove(onCell);

        // console.log(selectedCell); // !! говорит о том что элемент есть -> true
      }
    }
  }

  // получение координаты фигуры
  public getCell(x: number, y: number) {
    return this.cells[y][x];
  }
  private addPawn() {
    for (let i = 0; i < 8; i++) {
      new Pawn(Colors.BLACK, this.getCell(i, 1));
      new Pawn(Colors.WHITE, this.getCell(i, 6));
    }
  }
  private addElephant() {
    new Elephant(Colors.BLACK, this.getCell(2, 0));
    new Elephant(Colors.BLACK, this.getCell(5, 0));
    new Elephant(Colors.WHITE, this.getCell(2, 7));
    new Elephant(Colors.WHITE, this.getCell(5, 7));
  }
  private addRook() {
    new Rook(Colors.BLACK, this.getCell(0, 0));
    new Rook(Colors.BLACK, this.getCell(7, 0));
    new Rook(Colors.WHITE, this.getCell(0, 7));
    new Rook(Colors.WHITE, this.getCell(7, 7));
  }
  private addKnight() {
    new Knight(Colors.BLACK, this.getCell(1, 0));
    new Knight(Colors.BLACK, this.getCell(6, 0));
    new Knight(Colors.WHITE, this.getCell(1, 7));
    new Knight(Colors.WHITE, this.getCell(6, 7));
  }
  private addQueen() {
    new Queen(Colors.BLACK, this.getCell(3, 0));
    new Queen(Colors.WHITE, this.getCell(3, 7));
  }
  private addKing() {
    new King(Colors.BLACK, this.getCell(4, 0));
    new King(Colors.WHITE, this.getCell(4, 7));
  }
  public addFigure() {
    this.addElephant();
    this.addRook();
    this.addKnight();
    this.addQueen();
    this.addKing();
    this.addPawn();
  }
}
