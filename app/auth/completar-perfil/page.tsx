"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase/firebaseconfig";
import AlertSuccess from "@/components/comp-271";
import TextAreaOptional from "@/components/comp-63";
import { AtSign, Book, Calendar1, Image, University, User } from "lucide-react";
import InputIconStart from "@/components/comp-09";
import { useAuth } from "@/contexts/AuthContext";

const CompletarPerfil = () => {
  const { userProfile, loading: authLoading } = useAuth();
  const [formData, setFormData] = useState({
    nombres: "",
    apellidos: "",
    username: "",
    universidad: "",
    carrera: "",
    semestre: "",
    photoURL: "",
    descripcion: "",
    fotoportada: "",
  });

  const [saving, setSaving] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (userProfile) {
      setFormData({
        nombres: userProfile.nombres || "",
        apellidos: userProfile.apellidos || "",
        username: userProfile.username || "",
        universidad: userProfile.universidad || "",
        carrera: userProfile.carrera || "",
        semestre: userProfile.semestre || "",
        photoURL: userProfile.photoURL || "",
        descripcion: userProfile.descripcion || "",
        fotoportada: userProfile.fotoportada || "",
      });
    }
  }, [userProfile]);

  if (authLoading) {
    return <div className="flex items-center justify-center min-h-screen">Cargando...</div>;
  }

  if (!userProfile) {
    router.push("/login");
    return null;
  }

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateDoc(doc(db, "users", userProfile.uid), {
        ...formData,
        profileCompleted: true,
      });
      setShowAlert(true);
      setTimeout(() => {
        router.push("/");
      }, 2000);
    } catch (error) {
      console.error("Error al guardar:", error);
    } finally {
      setSaving(false);
    }
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
              Value={formData.nombres}
              labeel="Nombres"
              placeholder="Nombres"
              type="text"
              Icon={User}
              onchange={(e) =>
                setFormData((prev) => ({ ...prev, nombres: e.target.value }))
              }
            />
            <InputIconStart
              required
              Value={formData.apellidos}
              labeel="Apellidos"
              placeholder="Apellidos"
              type="text"
              Icon={User}
              onchange={(e) =>
                setFormData((prev) => ({ ...prev, apellidos: e.target.value }))
              }
            />
            <InputIconStart
              required
              Value={formData.username}
              labeel="Nombre de usuario"
              placeholder="Nombre de usuario"
              type="text"
              Icon={AtSign}
              onchange={(e) =>
                setFormData((prev) => ({ ...prev, username: e.target.value }))
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
              Value={formData.universidad}
              labeel="Universidad"
              placeholder="Universidad"
              type="text"
              Icon={University}
              onchange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  universidad: e.target.value,
                }))
              }
            />
            <InputIconStart
              required
              Value={formData.carrera}
              labeel="Carrera"
              placeholder="Carrera"
              type="text"
              Icon={Book}
              onchange={(e) =>
                setFormData((prev) => ({ ...prev, carrera: e.target.value }))
              }
            />
            <InputIconStart
              required
              Value={formData.semestre}
              labeel="Semestre"
              placeholder="Semestre"
              type="number"
              Icon={Calendar1}
              onchange={(e) =>
                setFormData((prev) => ({ ...prev, semestre: e.target.value }))
              }
            />
          </div>

          {/* Columna 3: Otros Datos */}
          <div className="flex flex-col space-y-3">
            <h3 className="text-xl font-semibold text-beige mb-4">
              Otros Datos
            </h3>
            <TextAreaOptional
              Labeel="Sobre mi"
              placeholder="Sobre mi"
              value={formData.descripcion}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  descripcion: e.target.value,
                }))
              }
            />

            <InputIconStart
              Value={formData.photoURL}
              labeel="Foto de perfil (URL)"
              placeholder="Foto de perfil (URL)"
              type="text"
              Icon={Image}
              onchange={(e) =>
                setFormData((prev) => ({ ...prev, photoURL: e.target.value }))
              }
            />
            <InputIconStart
              Value={formData.fotoportada}
              labeel="Foto de portada (URL)"
              placeholder="Foto de portada (URL)"
              type="text"
              Icon={Image}
              onchange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  fotoportada: e.target.value,
                }))
              }
            />
          </div>
        </form>

        <div className="flex justify-center mt-6">
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-6 py-2 bg-beige text-black font-semibold rounded-lg hover:bg-beige/90 transition-colors"
          >
            {saving ? "Guardando..." : "Guardar Cambios"}
          </button>
        </div>

        {showAlert && (
          <AlertSuccess content="¡Perfil actualizado correctamente!" />
        )}
      </div>
    </div>
  );
};

export default CompletarPerfil;
