"use client";

import React, { useState } from "react";

const GRID_SIZE = 16;
const NUMBERS_SEQUENCE = [1, 3, 1, 4];

const HEART_OUTLINE = [
  [-7, -2],
  [-7, 2],
  [-6, -3],
  [-6, -1],
  [-6, 1],
  [-6, 3],
  [-5, -4],
  [-5, 0],
  [-5, 4],
  [-4, -4],
  [-4, 4],
  [-3, -3],
  [-3, 3],
  [-2, -2],
  [-2, 2],
  [-1, -1],
  [-1, 1],
  [0, 0],
];

export default function HeartMinesweeper() {
  const [clickedCount, setClickedCount] = useState(0);
  const [revealed, setRevealed] = useState({});
  const [clickedHeartCell, setClickedHeartCell] = useState(null);
  const [heartShown, setHeartShown] = useState(false);

  const handleClick = (r, c) => {
    const key = `${r}-${c}`;
    if (revealed[key]) return; // ignore already revealed

    if (clickedCount < 4) {
      // Show numbers 1,3,1,4 in order on first 4 clicks
      setRevealed((prev) => ({
        ...prev,
        [key]: NUMBERS_SEQUENCE[clickedCount],
      }));
      setClickedCount(clickedCount + 1);
    } else if (clickedCount === 4) {
      // On 5th click, reveal heart bombs alongside existing numbers

      // Find offset to center heart so clicked cell is on outline
      let bestOffset = null;

      for (const [dr, dc] of HEART_OUTLINE) {
        const offsetRow = r - dr;
        const offsetCol = c - dc;

        const inBounds = HEART_OUTLINE.every(([hr, hc]) => {
          const rr = offsetRow + hr;
          const cc = offsetCol + hc;
          return rr >= 0 && rr < GRID_SIZE && cc >= 0 && cc < GRID_SIZE;
        });

        if (inBounds) {
          bestOffset = [offsetRow, offsetCol];
          break;
        }
      }

      if (!bestOffset) {
        alert("Too close to the edge for a heart to appear!");
        return;
      }

      const [offsetR, offsetC] = bestOffset;

      setRevealed((prev) => {
        const newRevealed = { ...prev };
        for (const [dr, dc] of HEART_OUTLINE) {
          const rr = offsetR + dr;
          const cc = offsetC + dc;
          newRevealed[`${rr}-${cc}`] = "💣";
        }
        return newRevealed;
      });

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
                  userSelect: "none",
                }}
              >
                {val}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
