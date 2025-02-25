import { Input } from "@/components/ui/input";
import { useId } from "react";
import { LucideIcon } from "lucide-react";
import { useState } from "react";

interface SimpleInputProps {
  id ?: string;
  type?: string;
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  Icon?: LucideIcon;
}

export default function SimpleInput({ id,  type = "text", placeholder, value, onChange, Icon }: SimpleInputProps) {
  const [isFocused, setIsFocused] = useState(false);
  return (
    <div className="space-y-1">
      <div className="relative group">
        {Icon && <Icon className="absolute left-3 top-1/2 -translate-y-1/2 text-beige/40 h-4 w-4 transition-colors group-focus-within:text-beige" />}
        <Input
          
          id={id}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => !value && setIsFocused(false)}
          className={`w-full pl-9 pr-3 py-2 bg-black/40 rounded-lg text-beige transition-all duration-200 text-sm group-focus-within:border-beige/50
                      border ${isFocused || value ? "border-beige/80" : "border-beige/10"} 
                      focus:outline-none focus:ring-2 focus:ring-beige/50 focus:ring-opacity-50`}
        />
      </div>
    </div>
  );
}
