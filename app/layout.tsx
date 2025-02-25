import { Inter, Space_Mono } from "next/font/google";
import "./globals.css";
import AuthGuard from "@/components/AuthRedirect";
import LayoutWrapper from "@/components/LayoutWrapper";
import type { Metadata } from "next";
import { AuthProvider } from "@/app/context/AuthContext";

export const metadata: Metadata = {
  title: "Uni-nova",
  description: "Plataforma educativa para compartir proyectos universitarios.",
};

// Fuentes de Google
const inter = Inter({
  subsets: ["latin"],
  weight: ["100", "300", "400", "500", "700", "900"],
  variable: "--font-inter",
  display: "swap",
});

const spaceMono = Space_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-space-mono",
  display: "swap",
});

// Envolver con AuthProvider
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${inter.variable} ${spaceMono.variable}`}>
      <body className="font-sans antialiased">
        <AuthProvider>
          <AuthGuard>
            <LayoutWrapper>{children}</LayoutWrapper>
          </AuthGuard>
        </AuthProvider>
      </body>
    </html>
  );
}
