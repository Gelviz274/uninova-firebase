"use client";

import React from "react";
import Image from "next/image";
import InputWhitIconEnd from "@/components/comp-10";
import { Search } from "lucide-react";
import AvatarIconDropbar from "@/components/comp-377";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { Skeleton } from "./ui/skeleton";
import { cn } from "@/lib/utils";

const skeletonClasses = "bg-beige/30 dark:bg-beige/20";

function Navbar() {
  const { loading } = useAuth();

  return (
    <header className="flex items-center sticky bg-neutral-800 w-full px-44 text-beige justify-around z-50 top-0 left-0 gap-6 shadow-md border-b border-beige">
      {/* Logo de Uni-nova */}
      <div>
        <Link href="/" className="flex items-center justify-center">
          <Image
            src="/LOGOUNINOVA.png"
            width={60}
            height={60}
            alt="Logo oficial de Uni-nova"
            className="cursor-pointer"
          />
          <h2 className="text-beige text-xl font-bold">Uni-nova</h2>
        </Link>
      </div>

      {/* Input de búsqueda */}
      <div className="flex-1 max-w-lg">
        {loading ? (
          <Skeleton className={cn("w-full h-11 rounded-xl", skeletonClasses)} />
        ) : (
          <InputWhitIconEnd
            id="Search"
            placeholder="Buscar..."
            className="w-full bg-beige/40 text-beige rounded-xl px-3 py-5 placeholder:text-beige"
            Icon={Search}
          />
        )}
      </div>

      {/* Avatar con Dropdown */}
      <div className="relative">
        {loading ? (
          <div className="flex items-center gap-2">
            <div className="flex items-center mb-0">
              <Skeleton className={cn("w-10 h-10 rounded-full", skeletonClasses)} />
              <div className="ml-2 space-y-2">
                <Skeleton className={cn("h-4 w-52", skeletonClasses)} />
              </div>
            </div>
          </div>
        ) : (
          <AvatarIconDropbar />
        )}
      </div>
    </header>
  );
}

export default Navbar;
