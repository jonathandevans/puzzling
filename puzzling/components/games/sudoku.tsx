"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import getSudokuPuzzleAction from "@/app/(games)/sudoku/actions";
import { Button } from "../ui/button";
import { Eraser } from "lucide-react";

export default function Sudoku() {
  const template = Array.from({ length: 9 }, () => Array(9).fill(0));
  const [values, setValues] =
    useState<{ value: number; static: boolean }[][]>(template);

  useEffect(() => {
    const fetchPuzzle = async () => {
      const _puzzle = await getSudokuPuzzleAction();
      const puzzle = _puzzle.map((row) =>
        row.map((cell) => {
          return { value: cell, static: cell !== 0 };
        })
      );

      setValues(puzzle);
    };
    fetchPuzzle();
  }, []);

  const [selected, setSelected] = useState([1, 1]);
  useEffect(() => {
    const keydown = (e: any) => {
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
        if (values[selected[0]][selected[1]].static) return;

        setValues((prev) => {
          return prev.map((row, rIdx) =>
            row.map((cell, cIdx) =>
              rIdx === selected[0] && cIdx === selected[1]
                ? { value: Number(e.key), static: cell.static }
                : cell
            )
          );
        });
        return;
      }

      if (e.key === "Backspace") {
        if (values[selected[0]][selected[1]].static) return;

        setValues((prev) => {
          return prev.map((row, rIdx) =>
            row.map((cell, cIdx) =>
              rIdx === selected[0] && cIdx === selected[1]
                ? { value: 0, static: cell.static }
                : cell
            )
          );
        });
        return;
      }

      console.log(e.key);
    };

    document.addEventListener("keydown", keydown);

    return () => document.removeEventListener("keydown", keydown);
  }, [selected]);

  return (
    <div className="flex flex-col gap-5 justify-center">
      <div className="grid grid-rows-3 grid-cols-3 gap-1 border-3 p-1">
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
                    >
                      <p
                        className={cn(
                          "text-2xl font-semibold cursor-default",
                          values[row][col].static && "text-neutral-400",
                          !values[row][col].static &&
                            // Row or Col duplicate
                            (values[row].filter(
                              (i) => i.value === values[row][col].value
                            ).length > 1 ||
                              values
                                .map((_, rIndex) => values[rIndex][col])
                                .filter(
                                  (i) => i.value === values[row][col].value
                                ).length > 1 ||
                              // Block duplicate
                              (() => {
                                const blockRowStart = Math.floor(row / 3) * 3;
                                const blockColStart = Math.floor(col / 3) * 3;
                                let count = 0;
                                for (
                                  let r = blockRowStart;
                                  r < blockRowStart + 3;
                                  r++
                                ) {
                                  for (
                                    let c = blockColStart;
                                    c < blockColStart + 3;
                                    c++
                                  ) {
                                    if (
                                      values[r][c].value ===
                                        values[row][col].value &&
                                      values[row][col].value !== 0
                                    ) {
                                      count++;
                                    }
                                  }
                                }
                                return count > 1;
                              })()) &&
                            "text-red-400"
                        )}
                      >
                        {values[row][col].value === 0
                          ? ""
                          : values[row][col].value}
                      </p>
                    </div>
                  );
                })
              )}
            </div>
          ))
        )}
      </div>

      <div className="flex justify-between">
        {Array.from({ length: 9 }).map((_, index) => (
          <Button
            key={index}
            variant="outline"
            size="icon"
            className="w-10 h-10"
            onClick={() => {
              if (values[selected[0]][selected[1]].static) return;

              setValues((prev) => {
                return prev.map((row, rIdx) =>
                  row.map((cell, cIdx) =>
                    rIdx === selected[0] && cIdx === selected[1]
                      ? { value: index + 1, static: cell.static }
                      : cell
                  )
                );
              });
            }}
          >
            {index + 1}
          </Button>
        ))}
        <Button
          variant="outline"
          size="icon"
          className="w-10 h-10"
          onClick={() => {
            if (values[selected[0]][selected[1]].static) return;

            setValues((prev) => {
              return prev.map((row, rIdx) =>
                row.map((cell, cIdx) =>
                  rIdx === selected[0] && cIdx === selected[1]
                    ? { value: 0, static: cell.static }
                    : cell
                )
              );
            });
          }}
        >
          <Eraser />
        </Button>
      </div>
    </div>
  );
}
