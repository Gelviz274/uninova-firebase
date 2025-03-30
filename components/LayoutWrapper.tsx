"use client";
import { usePathname } from "next/navigation";
import Navbar from "@/components/navbar";
import Sidebar from "@/components/sidebar";
import RecommendedUsers from "@/components/RecommendedUsers";

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const authPages = ["/auth/register", "/auth/login", "/auth/completar-perfil", "/auth"];
  const isAuthPage = authPages.includes(pathname) || pathname.startsWith("/auth/");
  const showHeader = !isAuthPage;

  return (
    <>
      {showHeader && <Navbar />}
      {isAuthPage ? (
        <main className="m-0">
          {children}
        </main>
      ) : (
        <div className="container max-w-7xl mx-auto flex gap-2 pt-1">
          <div className="w-72 sticky top-20 h-[calc(100vh-5rem)]">
            <Sidebar />
          </div>
          <main className="flex-1 min-w-0 md:w-[calc(100%-50rem)]">
            {children}
          </main>
          <div className="w-72 sticky top-20 h-[calc(100vh-5rem)] px-4">
            <RecommendedUsers />
          </div>
        </div>
      )}
    </>
  );
}
