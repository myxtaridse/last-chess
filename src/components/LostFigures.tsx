import React from "react";
import { Figure } from "../class/Figure";

interface LostFiguresProps {
  figures: Figure[];
}

const LostFigures: React.FC<LostFiguresProps> = ({ figures }) => {
  return (
    <div className="lost">
      {figures.map(
        (figure) =>
          figure.image && (
            <img key={Math.random()} src={figure.image} alt="figure" />
          )
      )}
    </div>
  );
};

export default LostFigures;
