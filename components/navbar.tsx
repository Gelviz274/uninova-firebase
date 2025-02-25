"use client";

import React, { useState} from "react";
import Image from "next/image";
import InputWhitIconEnd from "@/components/comp-10";
import { Search } from "lucide-react";
import { usePathname } from "next/navigation";
import AvatarIconDropbar from "@/components/comp-377";
import Link from "next/link";

function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);


  // No mostrar el navbar en estas rutas
  if (
    pathname.includes("/auth/register") ||
    pathname.includes("/auth/login") ||
    pathname.includes("/auth/completar-perfil")
  ) {
    return null;
  }

  return (
    <header className="flex items-center sticky bg-cafe w-full px-44 text-beige justify-around z-50 top-0 left-0 gap-6 shadow-md ">
      {/* Logo de Uni-nova */}
      <div>
        <Link href="/" className="flex items-center justify-center">
          <Image
            src="/LOGOUNINOVA.png"
            width={60 }
            height={60  }
            alt="Logo oficial de Uni-nova"
            className="cursor-pointer"
          />
          <h2 className="text-beige text-xl font-bold ">Uni-nova</h2>
        </Link>
      </div>

      {/* Input de búsqueda */}
      <div className="flex-1 max-w-lg">
        <InputWhitIconEnd
          id="Search"
          placeholder="Buscar..."
          value=""
          className="w-full bg-beige/40 text-beige border border-cafe rounded-xl px-3 py-5 focus:ring-2 focus:ring-beige placeholder:text-beige"
          Icon={Search}
        />
      </div>

      {/* Nombre y Avatar con Dropdown */}
      <div className="relative cursor-pointer">
        <div className="flex items-center gap-2" onClick={() => setOpen(!open)}>
          <AvatarIconDropbar />
        </div>
      </div>
    </header>
  );
}

export default Navbar;
