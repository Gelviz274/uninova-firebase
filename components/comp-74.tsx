"use client";

import { useCharacterLimit } from "@/hooks/use-character-limit";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useId } from "react";

interface TextAreaLimitsProps {
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  label?: string;
}

export default function CTextAreaLimitCharacters({
  placeholder,
  value: initialValue = "",
  onChange,
  label,
}: TextAreaLimitsProps) {
  const id = useId();
  const maxLength = 300;

  const { value, characterCount, handleChange, maxLength: limit } = useCharacterLimit({
    maxLength,
    initialValue,
  });

  // Fusiona la lógica de `useCharacterLimit` con la prop `onChange`
  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    handleChange(e); // Actualiza el estado interno del hook
    if (onChange) {
      onChange(e); // Ejecuta la función onChange pasada como prop
    }
  };

  return (
    <div className="space-y-2">
      {label && <Label htmlFor={id}>{label}</Label>}
      <Textarea
        id={id}
        value={value}
        maxLength={limit}
        className="bg-black/40 p-3 border border-beige/10 focus:border-beige rounded-md text-beige group-focus-within:text-beige min-h-[200px]"  
        onChange={handleTextChange}
        placeholder={placeholder}
        aria-describedby={`${id}-description`}
      />
      <p
        id={`${id}-description`}
        className="mt-2 text-right text-xs text-muted-foreground"
        role="status"
        aria-live="polite"
      >
        <span className="tabular-nums">{limit - characterCount}</span> caracteres restantes
      </p>
    </div>
  );
}
