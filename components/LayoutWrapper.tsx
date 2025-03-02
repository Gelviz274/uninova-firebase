"use client";
import { usePathname } from "next/navigation";
import Navbar from "@/components/navbar";

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const noHeaderPages = ["/auth/register", "/auth/login", "/auth/completar-perfil", "/auth"];
  const showHeader = !noHeaderPages.includes(pathname);

  return (
    <>
      {showHeader && <Navbar />}
      <main className="m-0">
        {children}
      </main>
    </>
  );
}
