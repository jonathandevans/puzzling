"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { Eraser } from "lucide-react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../ui/alert-dialog";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface Cell {
  value: number;
  static: boolean;
  error: boolean;
}

function convertPuzzle(p: number[][]): Cell[][] {
  return p.map((row) =>
    row.map((cell) => {
      return { value: cell, static: cell !== 0, error: false };
    })
  );
}

export default function Sudoku({ puzzle }: { puzzle: number[][] }) {
  const [selected, setSelected] = useState([1, 1]);
  const [grid, setGrid] = useState(convertPuzzle(puzzle));
  const [errors, setErrors] = useState(0);
  const [complete, setComplete] = useState(false);
  const router = useRouter();

  const updateGridCompletion = (grid: Cell[][]) => {
    for (let r = 0; r < 9; r++) {
      for (let c = 0; c < 9; c++) {
        if (grid[r][c].error || grid[r][c].value === 0) return;
      }
    }

    setComplete(true);
  };

  const updateGridErrors = (grid: Cell[][]) => {
    for (let r = 0; r < 9; r++) {
      for (let c = 0; c < 9; c++) {
        if (grid[r][c].static || grid[r][c].value === 0) continue;

        let err = false;

        // Check row
        for (let i = 0; i < 9; i++) {
          if (r == i) continue;

          if (grid[r][c].value === grid[i][c].value) {
            err = true;
            break;
          }
        }
        if (err) {
          grid[r][c].error = true;
          continue;
        }

        // Check col
        for (let i = 0; i < 9; i++) {
          if (c == i) continue;

          if (grid[r][c].value === grid[r][i].value) {
            err = true;
            break;
          }
        }
        if (err) {
          grid[r][c].error = true;
          continue;
        }

        // Check square
        const bRow = Math.floor(r / 3) * 3;
        const bCol = Math.floor(c / 3) * 3;
        for (let i = 0; i < 3; i++) {
          for (let j = 0; j < 3; j++) {
            if (r === bRow + i && c === bCol + j) continue;

            if (grid[r][c].value === grid[bRow + i][bCol + j].value) {
              err = true;
              break;
            }
          }
        }

        grid[r][c].error = err;
      }
    }

    return grid;
  };

  const updateGridNumber = (n: number) => {
    if (grid[selected[0]][selected[1]].static) return;

    setGrid((prev) => {
      const updated = prev.map((row, rIdx) =>
        row.map((cell, cIdx) =>
          rIdx === selected[0] && cIdx === selected[1]
            ? {
                value: n,
                static: cell.static,
                error: cell.error,
              }
            : cell
        )
      );

      const _updated = updateGridErrors(updated);
      // By using 1/2 we solve the rerendering problem
      if (n !== 0 && _updated[selected[0]][selected[1]].error)
        setErrors((prev) => prev + 1 / 2);

      if (n !== 0) updateGridCompletion(_updated);

      return _updated;
    });
  };

  useEffect(() => {
    const keydown = (e: any) => {
      // Move selected
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

      // Assign number
      if (!isNaN(Number(e.key))) {
        if (Number(e.key) === 0) return;
        updateGridNumber(Number(e.key));
        return;
      }

      // Erase number
      if (e.key === "Backspace") {
        if (grid[selected[0]][selected[1]].static) return;
        updateGridNumber(0);
        return;
      }
    };

    document.addEventListener("keydown", keydown);
    return () => document.removeEventListener("keydown", keydown);
  }, [selected]);

  return (
    <div className="flex flex-col justify-center gap-5">
      <AlertDialog open={errors === 3}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Game Over!</AlertDialogTitle>
            <AlertDialogDescription>
              You made three mistakes so for you the game is over. Better luck
              next time...
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <div className="flex justify-between items-center w-full gap-3">
              <Button asChild variant="outline">
                <Link href="/">Home</Link>
              </Button>
              <div className="flex items-center gap-3">
                <Button
                  onClick={() => {
                    setErrors(0);
                    setGrid(convertPuzzle(puzzle));
                  }}
                >
                  Retry
                </Button>
                <Button onClick={() => router.refresh()}>New Game</Button>
              </div>
            </div>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <AlertDialog open={complete}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>You Won!</AlertDialogTitle>
            <AlertDialogDescription>
              Well done! You completed to puzzle. Why don't you give a new
              puzzle a try...
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <div className="flex justify-between items-center w-full gap-3">
              <Button asChild variant="outline">
                <Link href="/">Home</Link>
              </Button>
              <div className="flex items-center gap-3">
                <Button onClick={() => router.refresh()}>New Game</Button>
              </div>
            </div>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <div>
        <div className="flex justify-between items-center">
          <p className="text-sm text-muted-foreground">{errors}/3 errors</p>

          <Button
            variant="link"
            className="text-muted-foreground text-sm"
            onClick={() => {
              setErrors(0);
              setGrid(convertPuzzle(puzzle));
            }}
          >
            Reset
          </Button>
        </div>

        <SudokuGrid grid={grid} selected={selected} setSelected={setSelected} />
      </div>

      <SudokuButtons updateGridNumber={updateGridNumber} />
    </div>
  );
}

function SudokuGrid({
  grid,
  selected,
  setSelected,
}: {
  grid: Cell[][];
  selected: number[];
  setSelected: (_: any) => void;
}) {
  return (
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
                        grid[row][col].value ===
                          grid[selected[0]][selected[1]].value &&
                          "!text-cyan-500",
                        grid[row][col].static && "text-neutral-400",
                        grid[row][col].error && "text-red-400"
                      )}
                    >
                      {grid[row][col].value === 0 ? "" : grid[row][col].value}
                    </p>
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

function SudokuButtons({
  updateGridNumber,
}: {
  updateGridNumber: (_: number) => void;
}) {
  return (
    <div className="flex justify-between">
      {Array.from({ length: 9 }).map((_, index) => (
        <Button
          key={index}
          variant="outline"
          size="icon"
          className="w-10 h-10"
          onClick={() => updateGridNumber(index + 1)}
        >
          {index + 1}
        </Button>
      ))}
      <Button
        variant="outline"
        size="icon"
        className="w-10 h-10"
        onClick={() => updateGridNumber(0)}
      >
        <Eraser />
      </Button>
    </div>
  );
}
