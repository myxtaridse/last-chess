import React from "react";

interface TimerProps {
  timer: number;
  sec: number;
}

const Timer: React.FC<TimerProps> = ({ timer, sec }) => {
  return (
    <div className="timer">
      {timer}:{sec < 10 ? `0${sec}` : sec}
    </div>
  );
};
export default Timer;
