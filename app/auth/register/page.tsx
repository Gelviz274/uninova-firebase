"use client";
import React, { useState } from "react";
import { Mail, Lock, User } from "lucide-react";
import Image from "next/image";
import { Google, Microsoft, Gitlab, Github } from "@/components/icons";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase/firebaseconfig";
import AlertSuccess from "@/components/comp-271";
import InputContrasena from "@/components/comp-51";
import SimpleInput from "@/components/comp-01";
import InputEye from "@/components/comp-23";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

const Register = () => {
  const [nombres, setNombre] = useState("");
  const [apellidos, setApellido] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const router = useRouter(); // Estado para mostrar la alerta

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

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
      router.push(`/`);

      setSuccess(true); // Mostrar la alerta
      } catch (err: any) {
      setError(err.message);
    }
  };
  return (
    <div
      className="min-h-screen bg-black flex items-center justify-center p-4 relative overflow-hidden">
      {success && <AlertSuccess
      content="Usuario registrado con exito" />}{" "}
      {/* Renderiza la alerta si el registro fue exitoso */}
      {/* Luces animadas de fondo */}
      <div className="absolute -top-40 -left-40 w-80 h-80 bg-beige/20 rounded-full blur-[100px] animate-pulse" />
      <div className="absolute top-40 -right-40 w-80 h-80 bg-[#463B2E]/40 rounded-full blur-[100px] animate-pulse delay-700" />
      <div className="absolute -bottom-52 left-40 w-80 h-80 bg-beige/30 rounded-full blur-[100px] animate-pulse delay-1000" />
      <div className="absolute -bottom-32 right-12 w-80 h-80 bg-beige/20 rounded-full blur-[100px] animate-pulse delay-1200" />
      <div className="bg-black/40 backdrop-blur-xl rounded-2xl shadow-2xl w-full max-w-md p-8 relative border border-white/10">
        <div className="flex items-center justify-center flex-col">
          <Image src="/LOGOUNINOVA.png" alt="Logo" width={100} height={100} />
          <h1 className="text-beige font-sans text-4xl font-bold text-center mb-2">
            Uni-nova
          </h1>
          <p className="text-beige/60 text-center mb-8">Crea tu cuenta</p>
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
          onChange={(e) => setPassword(e.target.value)} />
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
            <label htmlFor="terms" className="text-xs text-beige/70">
              Acepto los{" "}
              <a href="#" className="text-beige hover:text-beige/80">
                términos y condiciones
              </a>
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
              <div className="w-full border-t border-beige/10"></div>
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="px-2 bg-black text-beige/60">
                O regístrate con
              </span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button
              className="flex items-center justify-center gap-2 py-2 px-3
                             bg-black/40 border border-beige/10 rounded-lg
                             hover:bg-black/60 hover:border-beige/20
                             transition-all duration-200 group"
            >
              <Google className="h-4 w-4 text-beige" />
              <span className="text-xs font-medium text-beige/80 group-hover:text-beige">
                Google
              </span>
            </button>
            <button
              className="flex items-center justify-center gap-2 py-2 px-3
                             bg-black/40 border border-beige/10 rounded-lg
                             hover:bg-black/60 hover:border-beige/20
                             transition-all duration-200 group"
            >
              <Microsoft className="h-4 w-4 text-beige" />
              <span className="text-xs font-medium text-beige/80 group-hover:text-beige">
                Microsoft
              </span>
            </button>
            <button
              className="flex items-center justify-center gap-2 py-2 px-3
                             bg-black/40 border border-beige/10 rounded-lg
                             hover:bg-black/60 hover:border-beige/20
                             transition-all duration-200 group"
            >
              <Github className="h-4 w-4 text-beige" />
              <span className="text-xs font-medium text-beige/80 group-hover:text-beige">
                GitHub
              </span>
            </button>
            <button
              className="flex items-center justify-center gap-2 py-2 px-3
                             bg-black/40 border border-beige/10 rounded-lg
                             hover:bg-black/60 hover:border-beige/20
                             transition-all duration-200 group"
            >
              <Gitlab className="h-4 w-4 text-beige" />
              <span className="text-xs font-medium text-beige/80 group-hover:text-beige">
                GitLab
              </span>
            </button>
          </div>
          <p className="text-center text-xs text-beige/60">
            ¿Ya tienes una cuenta?{" "}
            <a
              href="/auth/login"
              className="font-medium text-beige hover:text-beige/80 transition-colors"
            >
              Inicia sesión aquí
            </a>
          </p>
          {error && <p className="text-red-500">{error}</p>}{" "}
          {/* Muestra errores si los hay */}
        </form>
      </div>
    </div>
  );
};

export default Register;
