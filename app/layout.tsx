import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = { title: "VentaDrop — Case Lab", description: "VentaDrop CS2-inspired case opening demo" };
export default function RootLayout({children}:{children:React.ReactNode}) { return <html lang="ru"><body>{children}</body></html>; }
