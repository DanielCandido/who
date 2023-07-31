"use client";

import React from "react";

interface Props {
  onClick: () => void;
  label: string;
}

const Button: React.FC<Props> = ({ onClick, label }) => {
  return (
    <div>
      <button onClick={onClick}>{label}</button>
    </div>
  );
};

export default Button;
