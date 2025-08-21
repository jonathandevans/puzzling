import Sudoku from "@/components/games/sudoku";
import getSudokuPuzzleAction from "./actions";
import Link from "next/link";

export default async function SudokuRoute() {
  const puzzle = await getSudokuPuzzleAction();

  return (
    <>
      <header className="p-5 absolute top-0 left-0 w-full">
        <div className="flex justify-start gap-5 max-w-7xl mx-auto items-center">
          <h2 className="font-semibold tracking-tighter text-2xl">
            <Link href="/">Puzzling</Link>
          </h2>
        </div>
      </header>

      <main className="flex flex-col min-w-screen min-h-screen items-center justify-center gap-8">
        <h1 className="font-bold text-5xl tracking-tight">Sudoku</h1>

        <Sudoku puzzle={puzzle} />
      </main>
    </>
  );
}
