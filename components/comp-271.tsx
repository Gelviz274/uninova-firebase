"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CircleCheck } from "lucide-react";

interface AlertSuccessProps {
  content?: string;
}


export default function AlertSuccess({ content }: AlertSuccessProps) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(false), 5000); // Ocultar después de 5s
    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 20 }} // Aparece desde abajo
          animate={{ opacity: 1, y: 0 }} // Se muestra suavemente
          exit={{ opacity: 0, y: 20 }} // Se esconde hacia abajo
          transition={{ duration: 0.5 }} // Duración de la animación
          className="fixed bottom-4 right-4 z-50 rounded-lg border border-white/10 bg-black/40 px-4 py-3 shadow-lg"
        >
          <p className="text-sm text-white flex items-center">
            <CircleCheck className="me-2 text-beige" size={20} strokeWidth={2} aria-hidden="true" />
            {content}
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
