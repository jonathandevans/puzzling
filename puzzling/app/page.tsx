import { Button } from "@/components/ui/button";
import { CircleArrowRight, Grid } from "lucide-react";
import Link from "next/link";

const minigames = [
  { label: "Sudoku", href: "/sudoku", icon: Grid },
  { label: "To be added", href: "/", icon: CircleArrowRight },
];

export default function HomeRoute() {
  return (
    <>
      <main className="flex flex-col min-w-screen min-h-screen items-center justify-center gap-5">
        <h1 className="font-bold text-7xl tracking-tight">Puzzling</h1>
        <div className="flex gap-3">
          {minigames.map((game) => (
            <Button
              key={game.href}
              asChild
              size="icon"
              variant="outline"
              className="p-8"
            >
              <Link href={game.href}>
                <game.icon className="size-7" />
              </Link>
            </Button>
          ))}
        </div>
      </main>
    </>
  );
}
