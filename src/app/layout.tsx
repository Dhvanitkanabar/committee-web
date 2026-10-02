import { Metadata } from "next";
import ClientLayout from "./client-layout";
import "./globals.css";

export const metadata: Metadata = {
  title: "Committee Web",
  description: "Premium technology committee platform",
  icons: {
    icon: "/logo.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased selection:bg-accent selection:text-white">
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
