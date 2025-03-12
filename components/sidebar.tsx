'use client';

import { Home, Compass, FolderOpen, Bookmark, Settings, User2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { Skeleton } from "./ui/skeleton";
import { cn } from "@/lib/utils";

const skeletonClasses = "bg-beige/30 dark:bg-beige/20";

export default function LeftMenuSidebar() {
  const { userProfile, loading } = useAuth();

  if (loading) {
    return (
      <div className="bg-transparent rounded-lg p-4 w-auto">
        {/* Skeleton del perfil */}
        <div className="flex items-center mb-6">
          <Skeleton className={cn("w-12 h-12 rounded-full mr-3", skeletonClasses)} />
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
    <div className="bg-transparent rounded-lg p-4 w-auto">
      {/* Sección de perfil */}
      <div className="flex items-center mb-6">
        <Image
          src={userProfile?.photoURL || "/default-user.avif"}
          alt="User Avatar"
          height={400}
          width={400}
          className="w-12 h-12 rounded-full mr-3"
        />
        <div>
          <h2 className="font-semibold text-beige">
            {userProfile?.nombres} {userProfile?.apellidos}
          </h2>
          <p className="text-sm text-gray-400">
            {userProfile?.email || "No hay un correo registrado"}
          </p>
        </div>
      </div>

      {/* Menú de navegación */}
      <nav>
        <ul className="space-y-2">
          <NavItem href="/" icon={Home} label="Inicio" />
          <NavItem 
            href={userProfile?.username ? `/${userProfile.username}` : "/login"} 
            icon={User2} 
            label="Perfil" 
          />
          <NavItem href="/explorar" icon={Compass} label="Explorar" />
          <NavItem href="/mis-proyectos" icon={FolderOpen} label="Mis Proyectos" />
          <NavItem href="/guardados" icon={Bookmark} label="Guardados" />
          <NavItem href="/configuracion" icon={Settings} label="Configuración" />
        </ul>
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
        <Icon className="mr-3 text-beige" size={20} />
        <span className="text-beige">{label}</span>
      </Link>
    </li>
  );
}
