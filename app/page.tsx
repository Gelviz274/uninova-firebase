"use client";
import React, { useState, useEffect } from "react";
import {
  getAuth,
  onAuthStateChanged,
  User as FirebaseUser,
} from "firebase/auth";
import { app } from "@/lib/firebase/firebaseconfig";
import CreateProject from "@/components/createproject";
import LeftMenuSidebar from "@/components/sidebar";
import { FileText, Image, TrendingUp, Video } from "lucide-react";

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
    <div className="bg-black/60 w-full m-0 h-full flex flex-col items-center justify-center">
      <div className="flex items-center justify-center h-full w-4/5">
        <div className="grid grid-cols-12 text-white w-full h-full gap-5 py-6">
          {/* Sidebar izquierdo */}
          <div className="col-span-3">
            <LeftMenuSidebar user={user} />
          </div>

          {/* Sección principal */}
          <div className="col-span-6 flex flex-col h-full items-center">
            <div className="w-full border border-beige/10 text-cafe bg-black/5 p-5 rounded-xl">
              <div className="flex items-center justify-center">
                <img
                  src={user?.photoURL || "/default-user.avif"}
                  alt="User Avatar"
                  className="w-12 h-12 rounded-full mr-3"
                />
                <CreateProject />
              </div>
              <div className="flex justify-around py-3">
                <button className=" text-beige/50 hover:text-beige/90 rounded-full px-4 py-2 flex gap-2">
                  <Image />
                  Imagenes
                </button>
                <button className=" text-beige/50 hover:text-beige/90 rounded-full px-4 py-2 flex gap-2">
                  <Video />
                  Videos
                </button>
                <button className=" text-beige/50 hover:text-beige/90 rounded-full px-4 py-2 flex gap-2">
                  <FileText />
                  Documentos
                </button>
                <button className=" text-cafe bg-beige px-6 py-2 rounded-full ">
                  Publicar
                </button>
              </div>
            </div>

            {/* Proyectos Recientes */}
            <div className="w-full mt-6 border bg-black/5 p-5 border-beige/10 rounded-xl">
              <h4 className="text-xl font-semibold text-cafe">
                Proyectos Recientes
              </h4>
              <div className="mt-4 p-4 bg-black/40 h-96 rounded-md border border-beige/10">
                Proyecto de Ejemplo 1
              </div>
              <div className="mt-4 p-4 bg-black/40 h-96 rounded-md border border-beige/10">
                Proyecto de Ejemplo 2
              </div>
            </div>
          </div>

          {/* Sidebar derecho */}
          <div className="col-span-3 border border-beige/10  p-4 rounded-lg">
            <div className="mt-4 p-4 bg-black/40 rounded-md border border-beige/10 flex flex-col">
              <div className="flex gap-2 items-center">
                <TrendingUp />
                <h4>Proyectos en tendencias</h4>
              </div>
            </div>
            <div className="mt-4 p-4 bg-black/40 rounded-md border border-beige/10">
              Proyectos más populares
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
