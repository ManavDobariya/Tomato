import React, { useEffect, useState } from "react";
import "./IntroLoader.css";

const text = "Tomato.";

const IntroLoader = () => {
  const [visibleCount, setVisibleCount] = useState(0);
  const [progress, setProgress] = useState(0);
  const [done, setDone] = useState(false);

  const letters = text.split("");

  useEffect(() => {
    let i = 0;

    const interval = setInterval(() => {
      i++;

      setVisibleCount(i);
      setProgress(Math.floor((i / letters.length) * 100));

      if (i >= letters.length) {
        clearInterval(interval);

        setTimeout(() => {
          setDone(true);
        }, 600);
      }
    }, 180);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="intro-container">

      <h1 className={`intro-text ${done ? "expand" : ""}`}>
        {letters.map((char, index) => (
          <span
            key={index}
            className={index < visibleCount ? "show" : ""}
          >
            {char}
          </span>
        ))}
      </h1>

      <div className={`circle-loader ${done ? "hide" : ""}`}>
  <svg width="120" height="120">  
    <circle
      cx="60"
      cy="60"
      r="50"                     
      stroke="#ddd"
      strokeWidth="8"        
      fill="none"
    />
    <circle
      cx="60"
      cy="60"
      r="50"
      stroke="#454545"
      strokeWidth="8"
      fill="none"
      strokeDasharray={2 * Math.PI * 50}
      strokeDashoffset={2 * Math.PI * 50 * (1 - progress / 100)}
      strokeLinecap="round"
      transform="rotate(-90 60 60)"
      style={{ transition: "stroke-dashoffset 0.3s ease" }}
    />
  </svg>

  <span className="percentage">{progress}%</span>
</div>

    </div>
  );
};

export default IntroLoader;