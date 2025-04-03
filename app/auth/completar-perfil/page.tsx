"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { doc, updateDoc, collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase/firebaseconfig";
import AlertSuccess from "@/components/comp-271";
import AlertError from "@/components/AlertError";
import { Loading } from "@/components/ui/loading";
import { AtSign, Book, Calendar1, University, User, AlertCircle } from "lucide-react";
import InputIconStart from "@/components/comp-09";
import { useAuth } from "@/contexts/AuthContext";
import CTextAreaLimitCharacters from "@/components/comp-74";

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
  const [error, setError] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
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

  // Validar el formato del nombre de usuario
  const validateUsernameFormat = (username: string) => {
    // Permitir solo letras, números, guiones bajos y guiones medios
    const usernameRegex = /^[a-zA-Z0-9_-]{3,20}$/;
    return usernameRegex.test(username);
  };

  // Verificar si el nombre de usuario ya existe
  const checkUsernameExists = async (username: string) => {
    if (!username || username === userProfile?.username) {
      return false; // Si no hay username o es el mismo que ya tenía, no hay conflicto
    }

    setIsCheckingUsername(true);
    try {
      const usersRef = collection(db, "users");
      const q = query(usersRef, where("username", "==", username));
      const querySnapshot = await getDocs(q);
      
      setIsCheckingUsername(false);
      return !querySnapshot.empty;
    } catch (error) {
      console.error("Error al verificar nombre de usuario:", error);
      setIsCheckingUsername(false);
      return false;
    }
  };

  // Manejar cambio en el campo username
  const handleUsernameChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFormData((prev) => ({ ...prev, username: value }));
    
    // Validar formato
    if (value && !validateUsernameFormat(value)) {
      setUsernameError("El nombre de usuario debe tener entre 3-20 caracteres y solo puede contener letras, números, guiones y guiones bajos.");
      return;
    }
    
    // Limpiar error si el formato es válido
    setUsernameError("");
    
    // Verificar si existe (con debounce para no hacer muchas consultas)
    if (value) {
      const timeoutId = setTimeout(async () => {
        const exists = await checkUsernameExists(value);
        if (exists) {
          setUsernameError("Este nombre de usuario ya está en uso.");
        }
      }, 500);
      
      return () => clearTimeout(timeoutId);
    }
  };

  if (authLoading) {
    return <Loading />;
  }

  if (!userProfile) {
    router.push("/login");
    return null;
  }

  const validateForm = () => {
    if (!formData.nombres) {
      setError("Por favor ingresa tu nombre.");
      return false;
    }
    
    if (!formData.apellidos) {
      setError("Por favor ingresa tus apellidos.");
      return false;
    }
    
    if (!formData.username) {
      setError("Por favor ingresa un nombre de usuario.");
      return false;
    }
    
    if (usernameError) {
      setError(usernameError);
      return false;
    }
    
    if (!formData.universidad) {
      setError("Por favor ingresa tu universidad.");
      return false;
    }
    
    if (!formData.carrera) {
      setError("Por favor ingresa tu carrera.");
      return false;
    }
    
    if (!formData.semestre) {
      setError("Por favor ingresa tu semestre.");
      return false;
    }
    
    return true;
  };

  const handleSave = async () => {
    if (!validateForm()) {
      return;
    }

    setSaving(true);
    setError("");
    
    try {
      // Verificar una última vez si el username ya existe
      if (formData.username !== userProfile.username) {
        const exists = await checkUsernameExists(formData.username);
        if (exists) {
          setError("Este nombre de usuario ya está en uso.");
          setSaving(false);
          return;
        }
      }
      
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
      setError("Ha ocurrido un error al guardar los datos. Por favor intenta de nuevo.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-white dark:bg-black">
      <div className="w-full max-w-4xl p-8 space-y-6 bg-neutral-50/80 dark:bg-black/40 border border-neutral-200 dark:border-beige/10 shadow-lg rounded-lg">
        <h2 className="text-3xl font-bold text-center text-cafe dark:text-beige">
          Completar Perfil
        </h2>

        <form className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Columna 1: Información Personal */}
          <div className="flex flex-col space-y-3">
            <h3 className="text-xl font-semibold text-cafe dark:text-beige mb-4">
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
            <div>
              <InputIconStart
                required
                Value={formData.username}
                labeel="Nombre de usuario"
                placeholder="Nombre de usuario"
                type="text"
                Icon={AtSign}
                onchange={handleUsernameChange}
              />
              {usernameError && (
                <p className="text-red-500 text-sm mt-1">{usernameError}</p>
              )}
              {isCheckingUsername && (
                <p className="text-blue-500 text-sm mt-1">Verificando disponibilidad...</p>
              )}
              <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                3-20 caracteres, solo letras, números, guiones y guiones bajos.
              </p>
            </div>
          </div>

          {/* Columna 2: Información Académica */}
          <div className="flex flex-col space-y-3">
            <h3 className="text-xl font-semibold text-cafe dark:text-beige mb-4">
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
            <h3 className="text-xl font-semibold text-cafe dark:text-beige mb-4">
              Otros Datos
            </h3>
            <CTextAreaLimitCharacters
              label="Sobre mi"
              placeholder="Cuentanos sobre ti!"
              value={formData.descripcion}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  descripcion: e.target.value,
                }))
              }
            />
          </div>
        </form>

        {error && (
          <AlertError content={error} Icon={AlertCircle} />
        )}

        <div className="flex justify-center mt-6">
          <button
            onClick={handleSave}
            disabled={saving || !!usernameError || isCheckingUsername}
            className={`px-6 py-2 bg-cafe dark:bg-beige text-white dark:text-black font-semibold rounded-lg transition-colors ${
              saving || !!usernameError || isCheckingUsername 
                ? "opacity-70 cursor-not-allowed" 
                : "hover:bg-cafe/90 dark:hover:bg-beige/90"
            }`}
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
