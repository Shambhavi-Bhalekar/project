import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "BlogHub — Share Your Story with the World",
  description:
    "A premium blogging platform to create, share, and discover amazing stories. Built with Next.js and FastAPI.",
  keywords: ["blog", "writing", "community", "stories"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" data-scroll-behavior="smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
      </head>
      <body className={`${inter.variable} antialiased min-h-screen`}>
        {children}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3500,
            style: {
              background: "#1a1a35",
              color: "#f1f0ff",
              border: "1px solid rgba(124,58,237,0.25)",
              backdropFilter: "blur(16px)",
              borderRadius: "12px",
              fontSize: "14px",
              fontWeight: "500",
              boxShadow:
                "0 8px 32px rgba(0,0,0,0.5), 0 0 0 1px rgba(124,58,237,0.1)",
            },
            success: {
              iconTheme: { primary: "#34d399", secondary: "#1a1a35" },
            },
            error: {
              iconTheme: { primary: "#f87171", secondary: "#1a1a35" },
            },
          }}
        />
      </body>
    </html>
  );
}
