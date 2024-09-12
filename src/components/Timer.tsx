import React from "react";

interface TimerProps {
  timer: number;
  sec: number;
}

const Timer: React.FC<TimerProps> = ({ timer, sec }) => {
  return (
    <div className="timer">
      <p>
        {timer}:{sec < 10 ? `0${sec}` : sec}
      </p>
    </div>
  );
};
export default Timer;
