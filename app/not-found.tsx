"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Home } from "lucide-react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-white dark:bg-neutral-900 flex flex-col items-center justify-center px-4 text-cafe dark:text-beige">
      <div className="max-w-3xl w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-neutral-50 dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-beige/10 p-8 md:p-12 shadow-xl"
        >
          <div className="flex flex-col items-center text-center">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="mb-6"
            >
              <div className="relative w-32 h-32 md:w-40 md:h-40">
                <div className="absolute inset-0 bg-gradient-to-br from-cafe to-[#D2B48C] dark:from-[#D2B48C] dark:to-cafe rounded-full opacity-20 blur-xl"></div>
                <div className="relative flex items-center justify-center w-full h-full">
                  <span className="text-7xl md:text-8xl font-bold text-cafe dark:text-[#D2B48C]">404</span>
                </div>
              </div>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="text-2xl md:text-3xl font-bold mb-3 text-cafe dark:text-beige"
            >
              Página no encontrada
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="text-cafe/70 dark:text-beige/70 mb-8 max-w-md"
            >
              Lo sentimos, la página que estás buscando no existe o ha sido movida.
              Puedes regresar al inicio o a la página anterior.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="flex flex-col sm:flex-row gap-4 w-full max-w-md"
            >
              <Button
                onClick={() => router.back()}
                variant="outline"
                className="flex-1 bg-transparent border border-cafe/20 dark:border-beige/20 text-cafe dark:text-beige hover:bg-cafe/5 dark:hover:bg-beige/5 hover:border-cafe/30 dark:hover:border-beige/30"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Regresar
              </Button>
              
              <Link href="/" className="flex-1">
                <Button className="w-full bg-cafe dark:bg-[#D2B48C] text-white dark:text-[#151515] hover:bg-[#6F370F] dark:hover:bg-[#C19A6B]">
                  <Home className="mr-2 h-4 w-4" />
                  Ir al inicio
                </Button>
              </Link>
            </motion.div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.5 }}
          className="mt-8 text-center"
        >
          <p className="text-cafe/50 dark:text-beige/50 text-sm">
            ¿Necesitas ayuda? Contacta a{" "}
            <Link href="/soporte" className="text-cafe dark:text-[#D2B48C] hover:underline">
              soporte
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}