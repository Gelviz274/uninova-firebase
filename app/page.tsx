import React from "react";
import { auth, db } from "@/lib/firebase/firebaseconfig";
import CreateProject from "@/components/createproject";

function HomePage() {

    const user = auth.currentUser;
    console.log("Usuario autenticado:", user);
  return (
    <div className="bg-black/90 w-full m-0 h-screen flex flex-col items-center justify-center">
      <div className="flex items-center justify-center h-full w-4/5 ">
        <div className="grid grid-cols-12 text-white w-full h-full gap-5  py-6">
          {/* Sidebar izquierdo */}
          <div className="col-span-3 flex flex-col border border-cafe text-cafe p-4"></div>

          {/* Sección principal con "¿Qué tienes pensado?" y proyectos */}
          <div className="col-span-6 flex flex-col h-full items-center">
            <div className="w-full  border border-beige/20 text-cafe bg-black/10 p-5 rounded-xl">
              <CreateProject />
              <button>
                Imagenes
              </button>
            </div>
            {/* Aquí irían los proyectos subidos */}
            <div className="w-full mt-6 border bg-black/10  p-5 border-beige/20 rounded-xl">
              <h4 className="text-xl font-semibold text-cafe">
                Proyectos Recientes
              </h4>
              {/* Mapea los proyectos aquí */}
              <div className="mt-4 p-4 bg-black/40 rounded-md border border-beige/10">
                Proyecto de Ejemplo 1
              </div>
              <div className="mt-4 p-4 bg-black/40 rounded-md border border-beige/10">
                Proyecto de Ejemplo 2
              </div>
            </div>
          </div>

          {/* Sidebar derecho */}
          <div className="col-span-3 flex flex-col border border-beige/10 bg-black/50 p-4">
            <h4 className="text-xl font-semibold text-white">Tendencias</h4>
            <div className="mt-4 p-4 bg-black/40 rounded-md border border-beige/10">
              Últimas tendencias de universidades
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
