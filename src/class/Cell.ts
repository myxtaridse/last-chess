import { Board } from "./Board";
import { Colors } from "./Colors";
import { Figure, FigureNames } from "./Figure";
import { Queen } from "./figures/Queen";

export class Cell {
  board: Board;
  readonly x: number;
  readonly y: number;
  readonly color: Colors;
  figure: Figure | null;
  available: boolean;
  id: number;
  position: string;

  constructor(
    board: Board,
    x: number,
    y: number,
    color: Colors,
    figure: Figure | null,
    vertical?: string,
    horizontal?: string
  ) {
    this.board = board;
    this.x = x;
    this.y = y;
    this.color = color;
    this.figure = figure;
    this.available = false;
    this.id = Math.random();
    this.position = `${vertical}${horizontal}`;
  }

  isEnemy(onCell: Cell): boolean {
    return onCell.figure ? this.figure?.color !== onCell.figure.color : false;
  }

  isEmpty() {
    return this.figure === null;
  }

  // направление фигур, разрешено ходить по горизонтали
  setHorizontal(onCell: Cell): boolean {
    if (this.y !== onCell.y) return false;
    const minX = Math.min(this.x, onCell.x);
    const maxX = Math.max(this.x, onCell.x);
    for (let x = minX + 1; x < maxX; x++) {
      if (!this.board.getCell(x, this.y).isEmpty()) return false;
    }
    return true;
  }
  setVertical(onCell: Cell): boolean {
    if (this.x !== onCell.x) return false;
    const minY = Math.min(this.y, onCell.y);
    const maxY = Math.max(this.y, onCell.y);
    for (let y = minY + 1; y < maxY; y++) {
      if (!this.board.getCell(this.x, y).isEmpty()) return false;
    }
    return true;
  }

  setDiagonal(onCell: Cell): boolean {
    const absX = Math.abs(onCell.x - this.x); // дает относительное значение
    const absY = Math.abs(onCell.y - this.y);
    if (absX !== absY) return false;
    const dx = this.x < onCell.x ? 1 : -1;
    const dy = this.y < onCell.y ? 1 : -1;
    for (let i = 1; i < absY; i++) {
      if (!this.board.getCell(this.x + dx * i, this.y + dy * i).isEmpty())
        return false;
    }
    return true;
  }

  setCastling(figure: Figure) {
    let figureRook = figure.cell.board.getCell(
      figure.cell.x === 1 ? figure.cell.x - 1 : figure.cell.x + 1,
      figure.cell.y
    );

    let figureCastling = figure.cell.board.getCell(
      figure.cell.x === 1 ? figure.cell.x + 1 : figure.cell.x - 1,
      figure.cell.y
    );
    if (figureRook.figure?.name === FigureNames.ROOK) {
      figureCastling.setFigure(figureRook.figure);
      figureRook.figure = null;
    }
  }

  request() {
    return this.board.cells.flat().filter((cell) => cell.figure !== null);
  }

  checkKingUnderAttack(thisCell: Cell, onCell: Cell, depth = 0): boolean {
    try {
      if (depth > 10) {
        // Ограничение глубины рекурсии
        console.error("Превышена максимальная глубина проверки");
        return false;
      }

      const all = this.request();

      const arr: Cell[] = [];
      const arr22: Cell[] = [];

      const king = all.find(
        (cell) =>
          cell.figure?.name === FigureNames.KING &&
          cell.figure?.color === thisCell.figure?.color
      );

      if (king) {
        let incel = this.canAttackKing(arr, arr22, king, thisCell, all, onCell);

        if (arr22.length > 0) {
          return false;
        }

        // if (this.canMoveNoPawnAttack(thisCell, onCell, all)) return true;

        if (incel && incel.length > 0) {
          if (thisCell.figure?.name === FigureNames.KING) {
            // return false;
            if (!!this.kingNotCanMove(thisCell, incel[0], onCell)) {
              // console.log(onCell);
              return false;
            }
          }
          if (
            !!this.canCloseKingBySacrificing(
              thisCell,
              onCell,
              incel[0],
              king,
              all
            )
          ) {
            // if (thisCell.figure?.name === FigureNames.KING) console.log(onCell);

            return true;
          }

          if (thisCell.figure?.name !== FigureNames.KING) {
            if (!!this.canProtectionKing(incel[0], onCell)) return true;
          }
          // if (thisCell.figure?.name === FigureNames.KING) console.log(onCell);

          return false;
        }

        if (arr.length > 0 && ((incel && incel.length === 0) || !incel)) {
          return false;
        }

        return !this.setNoAttack(thisCell, king, onCell, all);

        // return false;
        // if (this.setNoAttack(thisCell, king, onCell, all)) {
        //   if (thisCell.figure?.name === FigureNames.KING) {
        //     console.log(onCell);
        //   }

        //   return false;
        // }
        // if (thisCell.figure?.name === FigureNames.KING) {
        //   console.log(onCell);
        // }
        // return true;
      }

      return false;
    } catch (err) {
      console.log(err);
      return false;
    }
  }

  canMoveNoPawnAttack(thisCell: Cell, onCell: Cell, all: Cell[]) {
    const pawn = all.find((cell) => {
      return (
        cell.figure?.color !== thisCell.figure?.color &&
        cell.figure?.name === FigureNames.PAWN &&
        cell.figure?.canMove(onCell)
      );
    });
    const figureCopy = thisCell.figure;

    if (figureCopy && onCell.figure === null) onCell.setFigure(figureCopy);

    if (pawn?.figure?.canMove(onCell)) {
      onCell.figure = null;
      return false;
    }

    if (pawn && (pawn.x + 1 === onCell.x || pawn.x - 1 === onCell.x)) {
      return false;
    }
    if (pawn) {
      return true;
    }

    return false;
  }

  canProtectionKing(incel: Cell, onCell: Cell): boolean {
    return incel === onCell;
  }

  canAttackKing(
    arr: Cell[],
    arr22: Cell[],
    kingCell: Cell,
    thisCell: Cell,
    all: Cell[],
    onCell: Cell,
    depth = 0
  ) {
    if (depth > 10) {
      // Ограничение глубины рекурсии
      console.error("Превышена максимальная глубина проверки");
      return false;
    }
    try {
      return all.filter((cell) => {
        if (
          thisCell.figure?.name === FigureNames.KING &&
          cell.figure?.color !== thisCell.figure?.color &&
          cell.figure?.name === FigureNames.PAWN &&
          (thisCell.x === cell.x + 1 || thisCell.x === cell.x - 1) &&
          onCell.x !== cell.x &&
          onCell.y === (cell.y + 1 || cell.y - 1)
        ) {
          arr22.push(cell);
        }

        if (
          thisCell.figure?.name === FigureNames.KING &&
          cell.figure?.name !== FigureNames.PAWN &&
          cell.figure?.color !== thisCell.figure.color &&
          !cell.figure?.canMove(kingCell)
        ) {
          if (onCell.figure !== null) {
            const figureCopy = onCell.figure;
            onCell.figure = null;
            if (!!cell.figure?.canMove(onCell)) {
              onCell.figure = figureCopy;

              arr.push(cell);
            }
            onCell.figure = figureCopy;
          }

          if (cell.figure?.canMove(onCell)) {
            arr.push(cell);
          }
        }

        // if (thisCell.figure?.name === FigureNames.ROOK) console.log(cell.figure?.canMove(kingCell));

        return cell.figure?.canMove(kingCell);
      });
    } catch (err) {
      console.log(err);
      return null;
    }
  }

  setNoAttack(
    thisCell: Cell,
    kingCell: Cell,
    onCell: Cell,
    all: Cell[],
    depth = 0
  ) {
    try {
      // Ограничение глубины рекурсии для предотвращения зацикливания
      if (depth > 10) {
        console.error("Превышена максимальная глубина проверки");
        return false;
      }

      // Создаём копию фигуры на текущей клетке
      const currentFigure = thisCell.figure;

      // Убираем фигуру с текущей клетки только в контексте этой проверки
      thisCell.figure = null;
      let canAttackKing;
      let canAttackKingCell;
      // Находим все клетки с фигурами противоположного цвета, которые могут атаковать короля
      // for (let cell of all) {
      canAttackKing = all.some((cell) => {
        // Проверяем только клетки с фигурами противоположного цвета
        if (
          cell.figure &&
          cell.figure.name !== FigureNames.PAWN &&
          cell.figure.color !== currentFigure?.color
        ) {
          // Смотрим, может ли фигура на этой клетке атаковать короля

          if (cell.figure.canMove(kingCell)) {
            canAttackKingCell = cell;

            // thisCell.figure = currentFigure; // пропадает ладья в конце
            return canAttackKingCell;
          }
        }
      });

      thisCell.figure = currentFigure;

      if (canAttackKingCell) {
        for (let cellIncel of all) {
          if (cellIncel.figure?.color === currentFigure?.color) {
            if (cellIncel.figure?.canMove(thisCell)) {
              canAttackKing = false;
            }
          }
        }
      }

      if (onCell === canAttackKingCell) {
        return false;
      }

      // Восстанавливаем исходную фигуру на текущей клетке

      // Возвращаем результат проверки
      // if (!canAttackKing) {
      //   console.log(onCell);
      //   return false;
      // }
      return canAttackKing;
      // return canAttackKing;
    } catch (err) {
      console.error("Ошибка в функции setNoAttack:", err);
      return false;
    }
  }

  kingNotCanMove(thisCell: Cell, incel: Cell, onCell: Cell) {
    const figureKingCopy = thisCell.figure; // Сохраняем исходную фигуру
    thisCell.figure = null; // Удаляем фигуру временно
    const figureOnCellCopy = onCell.figure; // Сохраняем исходную фигуру
    onCell.figure = null;
    if (!!incel.figure?.canMove(onCell)) {
      // console.log(incel, thisCell, onCell);

      thisCell.figure = figureKingCopy;
      onCell.figure = figureOnCellCopy;
      return true;
    }
    thisCell.figure = figureKingCopy;
    onCell.figure = figureOnCellCopy;
    return false;
  }

  canCloseKingBySacrificing(
    thisCell: Cell,
    onCell: Cell,
    incel: Cell,
    kingCell: Cell,
    all: Cell[]
  ) {
    try {
      if (thisCell.figure?.name === FigureNames.KING) {
        const figureCopy = onCell.figure; // Сохраняем исходную фигуру
        onCell.figure = null; // Удаляем фигуру временно

        const attack = all.some((cell) => {
          if (
            cell.figure?.color !== thisCell.figure?.color &&
            cell.figure?.name === FigureNames.PAWN
          ) {
            if (cell.figure.canMove(onCell)) console.log(cell, onCell);
            // if (cell.figure?.canMove(onCell) && onCell.x !== cell.x) {
            //   console.log(cell, onCell);

            //   return true;
            // }
            // if (!cell.figure?.canMove(onCell) && onCell.x === cell.x) {
            //   console.log(cell, onCell);

            //   return false;
            // }
          }
          if (
            cell.figure?.color !== thisCell.figure?.color &&
            cell.figure?.name !== FigureNames.PAWN &&
            cell.figure?.canMove(onCell)
          ) {
            return true;
          }
        });

        onCell.figure = figureCopy;
        if (attack) {
          onCell.figure = figureCopy;
          return false;
        }
        if (!attack) return true;

        return false;
      }

      const closeCells = this.figureClose(kingCell, incel);

      return closeCells.includes(onCell);
    } catch (err) {
      console.log(err);
      return false;
    }
  }

  figureClose(kingCell: Cell, incel: Cell) {
    const closeCells: Cell[] = [];
    // Логика поиска клеток, которые можно занять, чтобы закрыть короля от атаки
    if (kingCell.setHorizontal(incel)) {
      const minX = Math.min(kingCell.x, incel.x);
      const maxX = Math.max(kingCell.x, incel.x);
      for (let x = minX + 1; x < maxX; x++) {
        closeCells.push(this.board.getCell(x, kingCell.y));
      }
    } else if (kingCell.setVertical(incel)) {
      const minY = Math.min(kingCell.y, incel.y);
      const maxY = Math.max(kingCell.y, incel.y);
      for (let y = minY + 1; y < maxY; y++) {
        closeCells.push(this.board.getCell(kingCell.x, y));
      }
    } else if (kingCell.setDiagonal(incel)) {
      const absX = Math.abs(incel.x - kingCell.x);
      // const absY = Math.abs(incel.y - kingCell.y);
      const dx = kingCell.x < incel.x ? 1 : -1;
      const dy = kingCell.y < incel.y ? 1 : -1;
      for (let i = 1; i < absX; i++) {
        closeCells.push(
          this.board.getCell(kingCell.x + dx * i, kingCell.y + dy * i)
        );
      }
    }
    return closeCells;
  }

  setFigure(figure: Figure) {
    this.figure = figure;
    this.figure.cell = this;

    if (
      this.figure.name === FigureNames.KING &&
      this.figure.isFirstStep &&
      (this.y === 7 || this.y === 0)
    ) {
      figure.cell.board.castling = true;
      this.figure.isFirstStep = false;
      this.setCastling(figure);
    } else if (
      this.figure.name === FigureNames.KING &&
      this.figure.isFirstStep
    ) {
      this.figure.isFirstStep = false;
    }
  }

  // добавление выпавших фигур
  addLostFigure(figure: Figure) {
    if (figure.color === Colors.BLACK) {
      this.board.lostBlackFugure.push(figure);
    } else {
      this.board.lostWhiteFugure.push(figure);
    }
  }

  gameOver(opponentColor: Colors) {
    try {
      const allCells = this.board.cells.flat();
      for (let cell of allCells) {
        if (cell.figure && cell.figure.color === opponentColor) {
          for (let targetCell of allCells) {
            // console.log(targetCell);

            if (cell.figure.canMove(targetCell)) return false;
          }
        }
      }
      return true;
    } catch (err) {
      console.log(err);
      return false;
    }
  }

  moveFigure(onCell: Cell) {
    this.board.prevCell = this;
    this.board.nowCell = onCell;
    // console.log(this.board.prevCell, this.board.nowCell);

    if (this.figure && this.figure.canMove(onCell)) {
      if (
        this.figure.color === Colors.WHITE &&
        this.figure.name === FigureNames.PAWN &&
        onCell.y === 0
      ) {
        this.figure = null;
        this.figure = new Queen(
          Colors.WHITE,
          this.board.getCell(this.x, this.y)
        );
      }
      if (
        this.figure.color === Colors.BLACK &&
        this.figure.name === FigureNames.PAWN &&
        onCell.y === 7
      ) {
        this.figure = null;
        this.figure = new Queen(
          Colors.BLACK,
          this.board.getCell(this.x, this.y)
        );
      }

      // Сохраняем текущее состояние фигур
      const originalFigure = onCell.figure;
      const currentFigure = this.figure;

      this.figure.moveFigure(onCell);

      // Если на целевой клетке была фигура, добавляем её в список потерянных фигур
      if (originalFigure) {
        this.addLostFigure(originalFigure);
      }

      onCell.setFigure(currentFigure); // Устанавливаем фигуру на новую клетку
      console.log("Ход выполнен."); // Отладочный вывод для проверки
      this.figure = null;

      const opponentColor =
        currentFigure.color === Colors.WHITE ? Colors.BLACK : Colors.WHITE;
      if (this.gameOver(opponentColor)) {
        console.log("Противник не может сделать ход. Игра окончена");
        this.board.isEnd = true;
      }
    }
  }
}
