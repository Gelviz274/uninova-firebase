"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Lock, LucideIcon } from "lucide-react";
import { useId, useState } from "react";

interface ConfirmPasswordProps {
  id ?: string;
  value: string;
  placeholder?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  Icon?: LucideIcon;
  required?: boolean;
} 
// HACER QUE LA CONTRASEÑA SEA IGUAL A LA CONTRASEÑA DE CONFIRMACIÓN
// Y QUE SE PUEDA MOSTRAR U OCULTAR

// HACER QUE EL COMPONENTE SE ACOPLE A LA PÁGINA DE REGISTRO Y A LA DE LOGIN 

export default function InputEye({ id, placeholder, value, onChange, Icon, required }: ConfirmPasswordProps) {
  const [isVisible, setIsVisible] = useState<boolean>(false);

  const toggleVisibility = () => setIsVisible((prevState) => !prevState);

  return (
    <div className="space-y-2">
      <div className="relative group">
      {Icon && <Icon className="absolute left-3 top-1/2 -translate-y-1/2 text-beige/40 h-4 w-4 transition-colors group-focus-within:text-beige" />}
        <Input
          id={id}
          value={value}
          onChange={onChange}
          required={required}
          className="w-full pl-9 pr-10 py-2 bg-black/40 border border-beige/10 rounded-lg text-beige
                     focus:outline-none focus:border-beige/30 focus:bg-black/60
                     transition-all duration-200 text-sm group-focus-within:border-beige"
          placeholder={placeholder}
          type={isVisible ? "text" : "password"}
        />
        <button
          className="absolute inset-y-0 right-3 flex items-center justify-center text-beige/80 outline-offset-2 transition-colors hover:text-beige/40 focus:z-10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-ring/70"
          type="button"
          onClick={toggleVisibility}
          aria-label={isVisible ? "Ocultar contraseña" : "Mostrar contraseña"}
          aria-pressed={isVisible}
        >
          {isVisible ? (
            <EyeOff size={16} strokeWidth={2} aria-hidden="true" />
          ) : (
            <Eye size={16} strokeWidth={2} aria-hidden="true" />
          )}
        </button>
      </div>
    </div>
  );
}
