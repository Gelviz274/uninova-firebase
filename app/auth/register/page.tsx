"use client";
import React, { useState, useEffect } from "react";
import { Mail, Lock, User } from "lucide-react";
import Image from "next/image";
import { Google, Microsoft, Gitlab, Github } from "@/components/icons";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase/firebaseconfig";
import AlertSuccess from "@/components/comp-271";
import AlertError from "@/components/AlertError";
import InputContrasena from "@/components/comp-51";
import SimpleInput from "@/components/comp-01";
import InputEye from "@/components/comp-23";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import Link from "next/link";

const Register = () => {
  const [nombres, setNombre] = useState("");
  const [apellidos, setApellido] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const router = useRouter(); // Estado para mostrar la alerta

  useEffect(() => {
    // Establecer título específico para la página de registro
    document.title = "Crear Cuenta | Uni-nova";
  }, []);

  const handleRegister = async (e: React.FormEvent) => {
    setError(""); // Restablecer el estado de error antes de intentar registrar nuevamente
    e.preventDefault();

    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    try {
      // Crear usuario en Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      // Guardar datos adicionales en Firestore
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        nombres,
        apellidos,
        email,
        createdAt: new Date(),
        username: "", // Pendiente
        universidad: "", // Pendiente
        carrera: "", // Pendiente
        semestre: "", // Pendiente
        fotoPerfil: "", // Pendiente
        descripcion: "", // Pendiente
        fotoportada: "", // Pendiente
        isSuperUser: false,
        profileCompleted: false, // Para saber si ya llenó los datos
      });

      // Redireccionar al perfil
      setTimeout(() => {
        router.push(`/`);
      }, 2000); // Esperar 2 segundos antes de redirigir
      setSuccess(true); // Mostrar la alerta
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "Error desconocido");
      return; // Asegurarse de que se detenga la ejecución si hay un error
    }
  };
  return (
    <div className="min-h-screen bg-white dark:bg-neutral-900 flex items-center justify-center p-4 relative overflow-hidden">
      {success && <AlertSuccess content="Usuario registrado con exito" />}{" "}
      {/* Renderiza la alerta si el registro fue exitoso */}
      {error && <AlertError Icon={Lock} content={error} />}{" "}
      {/* Muestra errores si los hay */}
      <div className="bg-white dark:bg-neutral-900 backdrop-blur-xl rounded-2xl shadow-2xl w-full max-w-md p-8 relative border border-white/10">
        <div className="flex items-center justify-center flex-col">
          <Image src="/LOGOUNINOVA.png" alt="Logo" width={100} height={100} />
          <h1 className="dark:text-beige text-cafe font-sans text-4xl font-bold text-center mb-2">
            Uni-nova
          </h1>
          <p className="dark:text-beige/60 text-cafe text-center mb-8">Crea tu cuenta</p>
        </div>

        <form onSubmit={handleRegister} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <motion.div
              whileFocus={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 200, damping: 10 }}
              className="w-full"
            >
              <SimpleInput
                id="firstName"
                type="text"
                placeholder="Nombres"
                value={nombres}
                onChange={(e) => setNombre(e.target.value)}
                Icon={User}
              />
            </motion.div>

            <motion.div whileFocus={{ scale: 1.05 }}>
              <SimpleInput
                id="lastName"
                type="text"
                placeholder="Apellidos"
                value={apellidos}
                onChange={(e) => setApellido(e.target.value)}
                Icon={User}
              />
            </motion.div>
          </div>
          <div className="relative group">
            <SimpleInput
              id="email"
              type="email"
              placeholder="Correo electrónico"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              Icon={Mail}
            />
          </div>
          <InputContrasena
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <div className="relative group">
            <InputEye
              Icon={Lock}
              placeholder="Confirmar contraseña"
              id="confirmPassword"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="terms"
              className="w-3.5 h-3.5 rounded border-beige/20 bg-black/40"
              required
            />
            <label htmlFor="terms" className="text-xs dark:text-beige/70 text-cafe">
              Acepto los{" "}
              <Link href="#" className="font-bold dark:text-beige/70 text-cafe">
                términos y condiciones
              </Link>
            </label>
          </div>
          <button
            type="submit"
            className="w-full bg-beige text-black py-2 rounded-lg font-medium text-sm
                     shadow-lg shadow-beige/10 hover:shadow-xl
                     hover:bg-[#463B2E] hover:text-beige
                     border border-beige/50
                     transition-all duration-300"
          >
            Crear Cuenta
          </button>
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-cafe/40 dark:border-beige/10"></div>
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="px-2 bg-white dark:bg-neutral-900 text-cafe dark:text-beige/60">
                O registrate con
              </span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button
              className="flex items-center justify-center gap-2 py-2 px-3
                             dark:bg-neutral-800 dark:hover:bg-neutral-700 bg-beige  border border-beige/10 rounded-lg
                             hover:bg-beige/80  hover:border-beige/20
                             transition-all duration-200 group"
            >
              <Google className="h-4 w-4 dark:text-beige text-cafe" />
              <span className="text-xs font-medium dark:text-beige text-cafe ">
                Google
              </span>
            </button>
            <button
              className="flex items-center justify-center gap-2 py-2 px-3
                             dark:bg-neutral-800 dark:hover:bg-neutral-700 bg-beige  border border-beige/10 rounded-lg
                             hover:bg-beige/80  hover:border-beige/20
                             transition-all duration-200 group"
            >
              <Microsoft className="h-4 w-4 dark:text-beige text-cafe" />
              <span className="text-xs font-medium dark:text-beige text-cafe ">
                Microsoft
              </span>
            </button>
            <button
              className="flex items-center justify-center gap-2 py-2 px-3
                             dark:bg-neutral-800 dark:hover:bg-neutral-700 bg-beige  border border-beige/10 rounded-lg
                             hover:bg-beige/80  hover:border-beige/20
                             transition-all duration-200 group"
            >
              <Github className="h-4 w-4 dark:text-beige text-cafe" />
              <span className="text-xs font-medium dark:text-beige text-cafe ">
                GitHub
              </span>
            </button>
            <button
              className="flex items-center justify-center gap-2 py-2 px-3
                             dark:bg-neutral-800 dark:hover:bg-neutral-700 bg-beige  border border-beige/10 rounded-lg
                             hover:bg-beige/80  hover:border-beige/20
                             transition-all duration-200 group"
            >
              <Gitlab className="h-4 w-4 dark:text-beige text-cafe" />
              <span className="text-xs font-medium dark:text-beige text-cafe ">
                GitLab
              </span>
            </button>
          </div>
          <p className="text-center text-xs text-cafe dark:text-beige/60">
            ¿Ya tienes una cuenta?{" "}
            <Link
              href="/auth/login"
              className="font-bold text-cafe dark:text-beige hover:text-beige/80 transition-colors"
            >
              Inicia sesión aquí
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Register;
