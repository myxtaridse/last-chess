import React from "react";
import logo from "/logo.svg";

interface ModalWindowProps {
  isGame: boolean;
  setIsGame: (isGame: boolean) => void;
  setBlackTimer: (timer: number) => void;
  setWhiteTimer: (timer: number) => void;
  timer: number;
}

const ModalWindow: React.FC<ModalWindowProps> = ({
  isGame,
  setIsGame,
  setBlackTimer,
  setWhiteTimer,
  timer,
}) => {
  const setTimerFn = (num: number) => {
    setBlackTimer(num);
    setWhiteTimer(num);
  };

  return (
    <div className={["modalWindow-bg", isGame ? "activeModal" : ""].join(" ")}>
      <div className="modalWindow">
        <div className="modal-logo">
          <img src={logo} alt="logo" />
        </div>
        <div className="modal-text">
          <h1>Шахматы</h1>
          <p>
            Добро пожаловать, любители шахмат! <br />
            Шахматы - это интеллектуальная игра, история которой насчитывает
            много веков. Это захватывающее состязание двух игроков, в котором
            каждый стремится поставить мат королю противника, используя фигуры и
            применяя различные стратегии. На нашем сайте мы предлагаем вам
            возможность насладиться классической игрой в шахматы. Здесь нет
            онлайн-игры и ботов - только вы и ваш соперник за шахматной доской.
            Наша платформа создана специально для тех, кто ценит живое общение и
            личное противостояние за шахматной партией. Окунитесь в атмосферу
            интеллектуального соперничества и дружеского общения за игровой
            доской. <br />
            Начните свою следующую партию прямо сейчас!
          </p>
          <div>
            <h2>Выберите время для партии:</h2>
          </div>
          <div className="modal-time">
            <span
              className={[timer === 5 ? "modal-time-active" : ""].join(" ")}
              onClick={() => setTimerFn(5)}
            >
              5 минут
            </span>
            <span
              className={[timer === 15 ? "modal-time-active" : ""].join(" ")}
              onClick={() => setTimerFn(15)}
            >
              15 минут
            </span>
            <span
              className={[timer === 30 ? "modal-time-active" : ""].join(" ")}
              onClick={() => setTimerFn(30)}
            >
              30 минут
            </span>
          </div>
          <button
            onClick={() => {
              if (timer !== 0) {
                setIsGame(true);
              }
            }}
            className="modal-button"
          >
            Начать игру
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalWindow;
