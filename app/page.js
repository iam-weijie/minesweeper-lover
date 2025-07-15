"use client";

import React, { useState } from "react";

const GRID_SIZE = 16;
const NUMBERS_SEQUENCE = [1, 3, 1, 4];

// A visually symmetric heart relative to (0,0), centered on 5th click
const HEART_MASK = [
  [-3, -1],
  [-3, 1],
  [-2, -2],
  [-2, 0],
  [-2, 2],
  [-1, -3],
  [-1, 3],
  [0, -3],
  [0, 3],
  [1, -2],
  [1, 2],
  [2, -1],
  [2, 1],
  [3, 0],
];

export default function Home() {
  const [clickedCount, setClickedCount] = useState(0);
  const [revealed, setRevealed] = useState({});
  const [heartShown, setHeartShown] = useState(false);
  const [clickedHeartCell, setClickedHeartCell] = useState(null);

  const handleClick = (r, c) => {
    const key = `${r}-${c}`;
    if (revealed[key]) return;

    if (clickedCount < 4) {
      setRevealed((prev) => ({
        ...prev,
        [key]: NUMBERS_SEQUENCE[clickedCount],
      }));
      setClickedCount(clickedCount + 1);
    } else if (clickedCount === 4) {
      // Show heart shape centered on (r, c)
      const newRevealed = {};
      HEART_MASK.forEach(([dr, dc]) => {
        const nr = r + dr;
        const nc = c + dc;
        if (nr >= 0 && nr < GRID_SIZE && nc >= 0 && nc < GRID_SIZE) {
          newRevealed[`${nr}-${nc}`] = "X";
        }
      });
      // Also mark the clicked center cell
      newRevealed[`${r}-${c}`] = "X";

      setRevealed(newRevealed);
      setClickedHeartCell(`${r}-${c}`);
      setHeartShown(true);
      setClickedCount(clickedCount + 1);
    }
  };

  return (
    <div style={{ textAlign: "center" }}>
      <h1>💘 Minesweeper: Lover Edition</h1>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${GRID_SIZE}, 30px)`,
          gap: 2,
          justifyContent: "center",
          marginTop: 20,
        }}
      >
        {[...Array(GRID_SIZE)].map((_, r) =>
          [...Array(GRID_SIZE)].map((_, c) => {
            const key = `${r}-${c}`;
            const val = revealed[key];
            const isClicked = key === clickedHeartCell;

            return (
              <div
                key={key}
                onClick={() => handleClick(r, c)}
                style={{
                  width: 30,
                  height: 30,
                  fontSize: 14,
                  backgroundColor: val
                    ? isClicked
                      ? "#ff4d4d"
                      : "#f9dada"
                    : "#888",
                  color: "#000",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  border: "1px solid #555",
                  cursor: val ? "default" : "pointer",
                }}
              >
                {val}
              </div>
            );
          })
        )}
      </div>
      <p style={{ marginTop: 20 }}>
        {heartShown
          ? "💥 You clicked a bomb and revealed a heart!"
          : `Click count: ${clickedCount} / 5`}
      </p>
    </div>
  );
}
