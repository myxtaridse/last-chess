import React from "react";
import LostFigures from "./LostFigures";
import { Colors } from "../class/Colors";
import { Player } from "../class/Player";
import kingW from "../assets/images/king-w.png";
import kingB from "../assets/images/king-b.png";
import { Board } from "../class/Board";
import Timer from "./Timer";

interface DirectionProps {
  playerColor: Player | null;
  board: Board;
  currentPlayer: Player | null;
  timer: number;
  sec: number;
}

const Direction: React.FC<DirectionProps> = ({
  playerColor,
  board,
  currentPlayer,
  timer,
  sec,
}) => {
  // console.log(playerColor === currentPlayer, playerColor);

  return (
    <div
      className={[
        "direction-block",
        playerColor?.color === Colors.BLACK ? "direction-b" : "direction-w",
        currentPlayer === playerColor ? "direction-bottom" : "direction-top",
      ].join(" ")}
    >
      <div className="direction">
        <div
          className={[
            "playerImg",
            playerColor?.color === Colors.BLACK ? "playerImg-b" : "playerImg-w",
          ].join(" ")}
        >
          <img
            src={playerColor?.color === Colors.BLACK ? kingB : kingW}
            alt="player"
          />
        </div>
        <div className="xp">
          <LostFigures
            figures={
              playerColor?.color === Colors.BLACK
                ? board.lostWhiteFugure
                : board.lostBlackFugure
            }
          />
        </div>
      </div>
      <div className="moves">
        <Timer timer={timer} sec={sec} />
        <div className="moves-player">
          <span>Ходы:</span>
          <div className="moves-flex">
            {playerColor?.color === Colors.BLACK
              ? board.moveBlack.map((move) => <p key={Math.random()}>{move}</p>)
              : board.moveWhite.map((move) => (
                  <p key={Math.random()}>{move}</p>
                ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Direction;
