"use client";

import { useEffect, useState } from "react";
import { KeyboardEvent } from "react";
import { cn } from "@/lib/utils";

export default function Sudoku() {
  const _values = Array.from({ length: 9 }, () => Array(9).fill(0));
  _values[4][4] = 9;
  const [values, setValues] = useState<number[][]>(_values);

  useEffect(() => {
    values.map((row, rowIndex) => {
      row.map((value, colIndex) => {
        const node = document.getElementById(`${rowIndex}-${colIndex}`);
        if (node) {
          node.innerHTML = `${value === 0 ? "" : value}`;
        }
      });
    });
    console.log(values);
  }, [values]);

  const [selected, setSelected] = useState([1, 1]);
  const keydown = (e: KeyboardEvent<HTMLDivElement>) => {
    switch (e.key) {
      case "ArrowUp":
        setSelected((prev) => {
          const updated = [...prev];
          if (updated[0] !== 0) {
            updated[0] = prev[0] - 1;
          }

          return updated;
        });
        return;
      case "ArrowDown":
        setSelected((prev) => {
          const updated = [...prev];
          if (updated[0] !== 8) {
            updated[0] = prev[0] + 1;
          }

          return updated;
        });
        return;
      case "ArrowLeft":
        setSelected((prev) => {
          const updated = [...prev];
          if (updated[1] !== 0) {
            updated[1] = prev[1] - 1;
          }

          return updated;
        });
        return;
      case "ArrowRight":
        setSelected((prev) => {
          const updated = [...prev];
          if (updated[1] !== 8) {
            updated[1] = prev[1] + 1;
          }

          return updated;
        });
        return;
    }

    if (!isNaN(Number(e.key))) {
      if (Number(e.key) === 0) return;

      setValues((prev) => {
        const temp = [...values];
        temp[selected[0]][selected[1]] = Number(e.key);

        return temp;
      });
      return;
    }

    if (e.key === "Backspace") {
      setValues((prev) => {
        const temp = [...values];
        temp[selected[0]][selected[1]] = 0;

        return temp;
      });
      return;
    }

    console.log(e.key);
  };

  return (
    <div className="grid grid-rows-3 grid-cols-3 gap-1">
      {Array.from({ length: 3 }).map((_, blockRow) =>
        Array.from({ length: 3 }).map((_, blockCol) => (
          <div
            key={`${blockRow}-${blockCol}`}
            className={cn(
              "grid grid-rows-3 grid-cols-3 border-2",
              Math.floor(selected[0] / 3) === blockRow &&
                Math.floor(selected[1] / 3) === blockCol &&
                "border-neutral-500"
            )}
          >
            {Array.from({ length: 3 }).map((_, cellRow) =>
              Array.from({ length: 3 }).map((_, cellCol) => {
                const row = blockRow * 3 + cellRow;
                const col = blockCol * 3 + cellCol;

                return (
                  <div
                    key={`${row}-${col}`}
                    className={cn(
                      "w-12 aspect-square border outline-none flex items-center justify-center",
                      row === selected[0] && "bg-primary-foreground",
                      col === selected[1] && "bg-primary-foreground",
                      row === selected[0] &&
                        col === selected[1] &&
                        "bg-neutral-600"
                    )}
                    onClick={(e) => {
                      setSelected([row, col]);
                    }}
                    onKeyDown={keydown}
                    tabIndex={0}
                    autoFocus={row === selected[0] && col === selected[1]}
                  >
                    <p
                      id={`${row}-${col}`}
                      className="text-2xl font-semibold"
                    />
                  </div>
                );
              })
            )}
          </div>
        ))
      )}
    </div>
  );
}
