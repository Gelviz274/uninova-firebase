import { useEffect, useState } from "react";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase/firebaseconfig";
import { ThumbsUp, MessageCircle, Bookmark, Share2 } from "lucide-react";

// Definir interfaces para los usuarios y proyectos
interface UserProps {
  id?: string;
  nombre: string;
  apellido: string;
  fotoPerfil: string;
  username: string;
  universidad: string;
  carrera: string;
}

interface ProjectProps {
  id?: string;
  title: string;
  description: string;
  autorId: string;
  autor?: UserProps; // Datos del usuario que subió el proyecto
}

export default function ListaProyectos() {
  const [proyectos, setProyectos] = useState<ProjectProps[]>([]);

  useEffect(() => {
    const fetchProyectos = async () => {
      try {
        const proyectosRef = collection(db, "projects");
        const snapshot = await getDocs(proyectosRef);

        const proyectosData: ProjectProps[] = await Promise.all(
          snapshot.docs.map(async (docProject) => {
            const project = {
              id: docProject.id,
              ...(docProject.data() as ProjectProps),
            };

            // Obtener datos del usuario (autor del proyecto)
            const userRef = doc(db, "users", project.autorId);
            const userSnap = await getDoc(userRef);
            if (userSnap.exists()) {
              const userData = userSnap.data() as UserProps;
              project.autor = {
                ...userData,
                fotoPerfil:
                  userData.fotoPerfil && userData.fotoPerfil.trim() !== ""
                    ? userData.fotoPerfil
                    : "/default-user.avif", // Imagen por defecto
              };
            } else {
              project.autor = {
                nombre: "Usuario desconocido",
                apellido: "",
                fotoPerfil: "https://via.placeholder.com/50",
                username: "desconocido",
                universidad: "desconocido",
                carrera: "desconocido",
              };
            }

            return project;
          })
        );

        setProyectos(proyectosData);
      } catch (error) {
        console.error("Error al obtener proyectos:", error);
      }
    };

    fetchProyectos();
  }, []);

  return (
    <div className="bg-transparent w-full h-auto">
      <ul className="space-y-4">
        {proyectos.map((proyecto) => (
          <li
            key={proyecto.id}
            className="bg-[#202020] rounded-xl border border-beige/10 overflow-hidden flex flex-col h-96"
          >
            {/* Post Header */}
            <div className="p-4 flex items-center space-x-3">
              <img
                src={proyecto.autor?.fotoPerfil}
                alt="Foto de perfil"
                className="h-10 w-10 rounded-full object-cover"
              />
              <div>
                <div className="font-medium text-beige flex gap-2">
                  <h4>

                  {proyecto.autor?.nombre} {proyecto.autor?.apellido}
                  </h4>
                  <p className="text-muted-foreground">/@{proyecto.autor?.username}</p>
                </div>
                <div className="text-sm text-beige/80 flex gap-1">
                  <p>{proyecto.autor?.universidad}</p>
                  <p>- {proyecto.autor?.carrera}</p>
                </div>
              </div>
            </div>

            {/* Post Content */}
            <div className="px-4 pb-3 flex-grow">
              <h4 className="text-lg font-semibold text-white">
                {proyecto.title}
              </h4>
              <p className="text-sm text-gray-200 mt-1">
                {proyecto.description}
              </p>
            </div>

            {/* Botones de interacción */}
            <div className="flex justify-around p-4 border-t border-white/10 bg-[#1e1e1e] mt-auto">
              <button className="flex items-center gap-1 text-gray-400 hover:text-beige">
                <ThumbsUp size={18} />
                <span className="text-sm">Like</span>
              </button>
              <button className="flex items-center gap-1 text-gray-400 hover:text-beige">
                <MessageCircle size={18} />
                <span className="text-sm">Comentar</span>
              </button>
              <button className="flex items-center gap-1 text-gray-400 hover:text-beige">
                <Bookmark size={18} />
                <span className="text-sm">Guardar</span>
              </button>
              <button className="flex items-center gap-1 text-gray-400 hover:text-beige">
                <Share2 size={18} />
                <span className="text-sm">Compartir</span>
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
