"use client";
import { useCharacterLimit } from "@/hooks/use-character-limit";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useId, useEffect, useState } from "react";

interface TextAreaLimitsProps {
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  label?: string;
}

export default function CTextAreaLimitCharacters({
  placeholder,
  value: externalValue = "",
  onChange,
  label,
}: TextAreaLimitsProps) {
  const id = useId();
  const maxLength = 300;
  
  // Use useState to track if the component should use the external value
  const [useExternalValue, setUseExternalValue] = useState(true);
  
  // Initialize hook with the external value
  const { value: hookValue, characterCount, handleChange, maxLength: limit } = useCharacterLimit({
    maxLength,
    initialValue: externalValue,
  });
  
  // Use the external value directly when it changes
  useEffect(() => {
    setUseExternalValue(true);
  }, [externalValue]);
  
  // The displayed value is either from the external prop or from the hook's internal state
  const displayValue = useExternalValue ? externalValue : hookValue;
  
  // Combined change handler
  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    // After user input, use the hook's internal state tracking
    setUseExternalValue(false);
    
    // Update the hook's internal state
    handleChange(e);
    
    // Call the external onChange if provided
    if (onChange) {
      onChange(e);
    }
  };

  return (
    <div className="space-y-2">
      {label && <Label className="text-beige/80" htmlFor={id}>{label}</Label>}
      <Textarea
        id={id}
        value={displayValue}
        maxLength={limit}
        className="bg-black/40 p-3 border border-beige/10 focus:border-beige rounded-md text-beige group-focus-within:text-beige min-h-[250px]"  
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