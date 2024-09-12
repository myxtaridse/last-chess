import React from "react";
import logo from "/logo.svg";
import { Player } from "../class/Player";

interface ModalEndProps {
  isEnd: boolean;
  currentPlayer: Player | null;
}

const ModalEnd: React.FC<ModalEndProps> = ({ isEnd, currentPlayer }) => {
  return (
    <div className={["modalWindow-bg", !isEnd ? "activeModal" : ""].join(" ")}>
      <div className="modalWindow">
        <div className="modal-logo">
          <img src={logo} alt="logo" />
        </div>
        <div className="modal-text">
          <h1>Партия окончена!</h1>
          <h2>{currentPlayer?.color} выиграли</h2>
          <p>
            Что за великолепный поединок мы только что наблюдали! Оба игрока
            продемонстрировали блестящее знание шахматной теории, тонкое
            тактическое мышление и умение находить нестандартные ходы. <br />
            Поздравляем победителя! Ваша игра была истинным воплощением
            шахматного искусства. Вы проявили выдающееся мастерство,
            аналитические способности и волю к победе. Проигравшему также стоит
            отдать должное - его игра была на очень высоком уровне, и он
            сражался до самого конца. Такие партии обогащают опыт всех любителей
            шахмат. <br /> Благодарим вас за захватывающее шахматное состязание!
            Вы подарили нам истинный праздник интеллекта.
          </p>
          <h2>Ждем новых встреч за доской!</h2>
        </div>
      </div>
    </div>
  );
};

export default ModalEnd;
