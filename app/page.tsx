"use client";
import React, { useState, useEffect } from "react";
import {
  getAuth,
  onAuthStateChanged,
  User as FirebaseUser,
} from "firebase/auth";
import Image from "next/image";
import { app } from "@/lib/firebase/firebaseconfig";
import CreateProject from "@/components/createproject";
import { FileText, ImageIcon, Video } from "lucide-react";
import ListaProyectos from "@/components/utils/Projects";

function HomePage() {
  const [user, setUser] = useState<FirebaseUser | null>(null);

  useEffect(() => {
    const auth = getAuth(app);
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="w-full m-0 h-full flex flex-col items-center justify-center border-x dark:border-beige/10 border-cafe/40">
      <div className="flex items-center justify-center h-full w-full px-4 py-4">
          {/* Sección principal */}
          <div className="col-span-2 flex flex-col h-full items-center w-full">
            <div className="w-full border dark:border-beige/10 border-cafe/40 text-cafe bg-white dark:bg-neutral-900 p-5 rounded-xl">
              <div className="flex items-center justify-center">
                <Image
                  src={user?.photoURL || "/default-user.avif"}
                  alt="User Avatar"
                  width={400}
                  height={400}
                  className="w-12 h-12 rounded-full mr-3"
                />
                <CreateProject
                  triggerButton={
                    <button className="w-full bg-cafe text-white text-start px-4 py-4 rounded-full ">
                      ¿Qué estás pensando?
                    </button>
                  }
                />
              </div>
              <div className="flex justify-between py-3 gap-1">
                <button className="dark:text-beige/50 text-cafe hover:text-beige/90 rounded-full px-4 py-2 flex gap-2">
                  <ImageIcon />
                  Imagenes
                </button>
                <button className="dark:text-beige/50 text-cafe hover:text-beige/90 rounded-full px-4 py-2 flex gap-2">
                  <Video />
                  Videos
                </button>
                <button className="dark:text-beige/50 text-cafe hover:text-beige/90 rounded-full px-4 py-2 flex gap-2">
                  <FileText />
                  Documentos
                </button>
                <button className="text-blacku bg-beige px-6 py-2 rounded-full ">
                  Publicar
                </button>
              </div>
            </div>

            {/* Proyectos Recientes */}
            <div className="w-full mt-5">
              <ListaProyectos />
            </div>
          </div>

      </div>
    </div>
  );
}

export default HomePage;
