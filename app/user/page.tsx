"use client";

import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { auth, db } from "@/lib/firebase/firebaseconfig";


// Definir la estructura de un proyecto
interface Project {
  id: string;
  autorId: string;
  createdAt: string;
  description: string;
  title: string;
}

export default function UserPage() {
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    const fetchProjects = async () => {
      if (!auth.currentUser) {
        console.log("El usuario no está autenticado");
        return;
      }

      try {
        const querySnapshot = await getDocs(collection(db, "projects"));
        const projectsData: Project[] = querySnapshot.docs.map(doc => {
          const data = doc.data() as Omit<Project, "id">; // 🔹 Excluir `id`
          return { id: doc.id, ...data };
        });

        setProjects(projectsData);
        console.log("Proyectos obtenidos:", projectsData);
      } catch (error) {
        console.error("Error obteniendo proyectos:", error);
      }
    };

    fetchProjects();
  }, []);

  return (
    <div>
      <h2>Lista de Proyectos</h2>
      {projects.length > 0 ? (
        <ul>
          {projects.map((project) => (
            <li key={project.id}>
              <strong>{project.title}</strong> - {project.description}
            </li>
          ))}
        </ul>
      ) : (
        <p>No hay proyectos disponibles.</p>
      )}
    </div>
  );
}


