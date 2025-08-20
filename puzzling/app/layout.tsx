import { ReactNode } from "react";
import type { Metadata } from "next";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { Nunito } from "next/font/google";
import "./globals.css";

const nunito = Nunito({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "Puzzling",
    template: "%s - Puzzling",
  },
  description:
    "Puzzling is your all-in-one hub for quick, fun, and brain-teasing puzzle minigames. Whether you're solving logic challenges, cracking patterns, or testing your memory, each puzzle is designed to keep you thinking and entertained. With bite-sized levels and endless variety, Puzzling is perfect for a quick break or a full-on puzzle marathon.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${nunito.className} antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
