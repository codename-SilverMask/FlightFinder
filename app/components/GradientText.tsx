"use client";

import React from "react";
import "./GradientText.css";

interface GradientTextProps {
  text: string;
  className?: string;
  as?: React.ElementType;
}

const GradientText: React.FC<GradientTextProps> = ({
  text,
  className = "",
  as: Component = "p",
}) => {
  return <Component className={`gradient-text ${className}`}>{text}</Component>;
};

export default GradientText;
