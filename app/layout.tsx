import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { SavedItemsProvider } from "@/components/SavedItemsProvider";
import { KnowledgeProvider } from "@/components/KnowledgeProvider";
import NavBar from "@/components/NavBar";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AI News Tracker",
  description: "A personal AI news digest and learning tool",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-zinc-50">
        <SavedItemsProvider>
          <KnowledgeProvider>
            <NavBar />
            <main className="flex-1">{children}</main>
          </KnowledgeProvider>
        </SavedItemsProvider>
      </body>
    </html>
  );
}
