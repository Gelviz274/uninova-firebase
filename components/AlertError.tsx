"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LucideIcon } from "lucide-react";

interface AlertErrorProps {
  content?: string;
  Icon: LucideIcon;
}


export default function AlertError({ content, Icon }: AlertErrorProps) {
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
          className="fixed bottom-4 right-4 z-[200] rounded-lg border border-red-500 bg-black/40 px-4 py-3 shadow-lg w-64"
        >
          <p className="text-sm text-red-border-red-500 flex items-center">
            {Icon && <Icon className="me-2 text-red-border-red-500" size={20} strokeWidth={2} aria-hidden="true" />}
            {content}
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
