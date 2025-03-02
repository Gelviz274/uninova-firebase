"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase/firebaseconfig";
import { onAuthStateChanged } from "firebase/auth";
import AlertSuccess from "@/components/comp-271";
import TextAreaOptional from "@/components/comp-63";
import CTextAreaLimitCharacters from "@/components/comp-74";
import {
  AtSign,
  Book,
  Calendar1,
  Image,
  University,
  User,
} from "lucide-react";
import InputIconStart from "@/components/comp-09";
const CompletarPerfil = () => {
  const [userData, setUserData] = useState({
    nombre: "",
    apellido: "",
    email: "",
    username: "",
    universidad: "",
    carrera: "",
    semestre: "",
    fotoPerfil: "",
    descripcion: "",
    fotoportada: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const router = useRouter();
  const [uid, setUid] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUid(user.uid);
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
          setUserData((prevState) => ({
            ...prevState,
            ...userDoc.data(),
          }));
        }
      } else {
        router.push("/login");
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [router]);

  const handleSave = async () => {
    if (!uid) return;

    setSaving(true);
    await updateDoc(doc(db, "users", uid), {
      ...userData,
      profileCompleted: true,
    });
    setSaving(false);
    setShowAlert(true);
    
    
    setTimeout(() => {
      router.push("/"); // Cambia la ruta según tu estructura
    }, 2000);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-black">
      <div className="w-full max-w-4xl p-8 space-y-6 bg-black/40 border border-beige/10 shadow-lg rounded-lg">
        <h2 className="text-3xl font-bold text-center text-beige">
          Completar Perfil
        </h2>

        <form className="grid grid-cols-3 gap-6">
          {/* Columna 1: Información Personal */}
          <div className="flex flex-col space-y-3">
            <h3 className="text-xl font-semibold text-beige mb-4">
              Información Personal
            </h3>
            <InputIconStart
              required
              Value={userData.nombre}
              labeel="Nombres"
              placeholder="Nombres"
              type="text"
              Icon={User}
              onchange={(e) =>
                setUserData((prev) => ({ ...prev, nombre: e.target.value }))
              }
            />
            <InputIconStart
              required
              Value={userData.apellido}
              labeel="Apellido"
              placeholder="Apellido"
              type="text"
              Icon={User}
              onchange={(e) =>
                setUserData((prev) => ({ ...prev, apellido: e.target.value }))
              }
            />
            <InputIconStart
              required
              Value={userData.username}
              labeel="Nombre de usuario"
              placeholder="Nombre de usuario"
              type="text"
              Icon={AtSign}
              onchange={(e) =>
                setUserData((prev) => ({ ...prev, username: e.target.value }))
              }
            />
          </div>

          {/* Columna 2: Información Académica */}
          <div className="flex flex-col space-y-3">
            <h3 className="text-xl font-semibold text-beige mb-4">
              Información Académica
            </h3>
            <InputIconStart
              required
              Value={userData.universidad}
              labeel="Universidad"
              placeholder="Universidad"
              type="text"
              Icon={University}
              onchange={(e) =>
                setUserData((prev) => ({
                  ...prev,
                  universidad: e.target.value,
                }))
              }
            />
            <InputIconStart
              required
              Value={userData.carrera}
              labeel="Carrera"
              placeholder="Carrera"
              type="text"
              Icon={Book}
              onchange={(e) =>
                setUserData((prev) => ({ ...prev, carrera: e.target.value }))
              }
            />
            <InputIconStart
              required
              Value={userData.semestre}
              labeel="Semestre"
              placeholder="Semestre"
              type="number"
              Icon={Calendar1}
              onchange={(e) =>
                setUserData((prev) => ({ ...prev, semestre: e.target.value }))
              }
            />
          </div>

          {/* Columna 3: Otros Datos */}
          <div className="flex flex-col space-y-3">
            <h3 className="text-xl font-semibold text-beige mb-4">
              Otros Datos
            </h3>
            {/* <CTextAreaLimitCharacters
            <CTextAreaLimitCharacters
              value={userData.descripcion}  
              placeholder="Sobre mi"
              label="Sobre mi"
              onChange={(e) =>
                setUserData((prev) => ({ ...prev, descripcion: e.target.value }))
              }
            />
            */}
            <TextAreaOptional
              Labeel="Sobre mi"
              placeholder="Sobre mi"
              value={userData.descripcion}
              onChange={(e) =>
                setUserData((prev) => ({
                  ...prev,
                  descripcion: e.target.value,
                }))
              }
            />

            <InputIconStart
              Value={userData.fotoPerfil}
              labeel="Foto de perfil (URL)"
              placeholder="Foto de perfil (URL)"
              type="text"
              Icon={Image}
              onchange={(e) =>
                setUserData((prev) => ({ ...prev, fotoPerfil: e.target.value }))
              }
            />
            <InputIconStart
              Value={userData.fotoportada}
              labeel="Foto de portada (URL)"
              placeholder="Foto de portada (URL)"
              type="text"
              Icon={Image}
              onchange={(e) =>
                setUserData((prev) => ({
                  ...prev,
                  fotoportada: e.target.value,
                }))
              }
            />
          </div>
        </form>

        <button
          type="button"
          onClick={handleSave}
          className="w-full bg-beige text-cafe p-3 rounded-md hover:bg-beige/80 disabled:opacity-50 mt-6"
          disabled={saving}
        >
          {saving ? "Guardando..." : "Guardar"}
        </button>

        {showAlert && <AlertSuccess
        content="Datos guardados con exito" />}
      </div>
    </div>
  );
};

export default CompletarPerfil;
