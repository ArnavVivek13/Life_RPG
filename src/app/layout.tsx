import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Life RPG — Gamified Real-World Progression",
  description: "Transform your daily habits and tasks into an engaging RPG progression adventure. Level up attributes, earn gold, and unlock rewards.",
  keywords: ["Life RPG", "Gamified Productivity", "Habit Tracker", "Next.js", "RPG Tasks"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased selection:bg-rpg-gold selection:text-black">
        {children}
      </body>
    </html>
  );
}
