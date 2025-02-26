import { useEffect, useState } from "react";
import { Home, Compass, FolderOpen, Bookmark, Settings } from "lucide-react";
import { User as FirebaseUser } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase/firebaseconfig"; // Asegúrate de importar correctamente Firestore

interface SidebarProps {
  user: FirebaseUser | null;
}

export default function LeftMenuSidebar({ user }: SidebarProps) {
  const [nombre, setNombre] = useState<string | null>(null);
  const [apellido, setApellido] = useState<string | null>(null);

  useEffect(() => {
    if (user?.uid) {
      const fetchUserData = async () => {
        try {
          const userDoc = await getDoc(doc(db, "users", user.uid));
          if (userDoc.exists()) {
            const userData = userDoc.data();
            setNombre(userData.nombre || "Invitado");
            setApellido(userData.apellido || "");
          }
        } catch (error) {
          console.error("Error al obtener datos del usuario:", error);
        }
      };
      fetchUserData();
    }
  }, [user]);

  return (
    <div className="bg-transparent rounded-lg p-4 w-auto">
      {/* Sección de perfil */}
      <div className="flex items-center mb-6">
        <img
          src={user?.photoURL || "/default-user.avif"}
          alt="User Avatar"
          className="w-12 h-12 rounded-full mr-3"
        />
        <div>
          <h2 className="font-semibold text-beige">
            {nombre} {apellido}
          </h2>
          <p className="text-sm text-gray-400">
            {user?.email || "No hay un correo registrado"}
          </p>
        </div>
      </div>

      {/* Menú de navegación */}
      <nav>
        <ul className="space-y-2">
          <NavItem href="/" icon={Home} label="Inicio" />
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
      <a
        href={href}
        className="flex items-center py-3 px-2 rounded-lg hover:bg-beige/40"
      >
        <Icon className="mr-3 text-beige" size={20} />
        <span className="text-beige">{label}</span>
      </a>
    </li>
  );
}
