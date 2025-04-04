"use client";

import {
  Home,
  Compass,
  FolderOpen,
  Bookmark,
  Settings,
  User2,
  CirclePlus,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { Skeleton } from "./ui/skeleton";
import { cn } from "@/lib/utils";
import CreateProject from "@/components/createproject";

const skeletonClasses = "bg-cafe/30 dark:bg-beige/20";

export default function LeftMenuSidebar() {
  const { userProfile, loading } = useAuth();

  if (loading) {
    return (
      <div className="bg-transparent rounded-lg p-4 w-auto">
        {/* Skeleton del perfil */}
        <div className="flex items-center mb-6">
          <Skeleton
            className={cn("w-12 h-12 rounded-full mr-3", skeletonClasses)}
          />
          <div className="space-y-2">
            <Skeleton className={cn("h-4 w-32", skeletonClasses)} />
            <Skeleton className={cn("h-3 w-40", skeletonClasses)} />
          </div>
        </div>

        {/* Skeleton del menú */}
        <nav>
          <ul className="space-y-2">
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <li key={item} className="flex flex-col gap-9">
                <div className="flex items-center py-3 px-2">
                  <Skeleton className={cn("h-5 w-5 mr-3", skeletonClasses)} />
                  <Skeleton className={cn("h-4 w-40", skeletonClasses)} />
                </div>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    );
  }

  return (
    <div className="bg-transparent rounded-lg px-4 w-auto">
      {/* Sección de perfil */}
      <div className="flex dark:bg-neutral-800 bg-white p-6 rounded-lg flex-col gap-2 items-center mb-6">
        <Image
          src={userProfile?.photoURL || "/default-user.avif"}
          alt="User Avatar"
          height={400}
          width={400}
          className="w-20 h-20 rounded-full mr-3"
        />
        <Link href={`/${userProfile?.username}`} className="hover:underline">
          <div className="flex flex-col items-center">
            <h2 className="font-semibold dark:text-beige text-cafe">
              {userProfile?.nombres} {userProfile?.apellidos}
            </h2>
            <p className="text-sm text-gray-400">
              @
              {userProfile?.username ||
                "No hay un nombre de usuario registrado"}
            </p>
          </div>
        </Link>
      </div>

      {/* Menú de navegación */}
      <nav className="space-y-2">
        <ul className="space-y-2">
          <NavItem href="/" icon={Home} label="Inicio" />
          <NavItem
            href={userProfile?.username ? `/${userProfile.username}` : "/login"}
            icon={User2}
            label="Perfil"
          />
          <NavItem href="/explorar" icon={Compass} label="Explorar" />
          <NavItem
            href="/mis-proyectos"
            icon={FolderOpen}
            label="Mis Proyectos"
          />
          <NavItem href="/guardados" icon={Bookmark} label="Guardados" />
          <NavItem
            href="/configuracion"
            icon={Settings}
            label="Configuración"
          />
        </ul>
        <CreateProject
          triggerButton={
            <button className="w-full flex text-white font-semibold items-center justify-center gap-2 bg-cafe text-start px-4 py-4 rounded-lg">
              <CirclePlus />
              Crear Proyecto
            </button>
          }
        />
      </nav>
    </div>
  );
}

// Componente reutilizable para los elementos del menú
function NavItem({
  href,
  icon: Icon,
  label,
}: {
  href: string;
  icon: React.ElementType;
  label: string;
}) {
  return (
    <li className="flex flex-col gap-9">
      <Link
        href={href}
        className="flex items-center py-3 px-2 rounded-lg hover:bg-beige/40"
      >
        <Icon className="mr-3 text-gray-800 dark:text-beige" size={20} />
        <span className="dark:text-beige text-gray-800">{label}</span>
      </Link>
    </li>
  );
}
