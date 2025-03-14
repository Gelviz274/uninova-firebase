import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LucideIcon } from "lucide-react";
import { useId } from "react";

interface InputProps {
  onchange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  labeel: string;
  placeholder: string;
  type: string;
  Icon?: LucideIcon;
  Value?: string;
  required?: boolean;
}

export default function InputIconStart({ labeel,  placeholder, type, Icon,Value,onchange, required }: InputProps) {
  const id = useId();
  return (
    <div className="space-y-2">
      <Label className="text-beige/80 flex items-center gap-1" htmlFor={id}>
        {labeel}
        {required && <span className="text-destructive">*</span>}
      </Label>
      <div className="relative">
        <Input id={id} 
        className="peer ps-9 bg-black/40 border border-beige/20 focus:border-beige rounded-md py-6 text-beige group-focus-within:border-beige" 
        onChange={onchange} 
        placeholder={placeholder} 
        type={type} 
        value={Value}
        required={required} // Asegura que el input realmente sea obligatorio
        />
        <div className="pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 text-beige/80 peer-disabled:opacity-50">
          {Icon && <Icon size={16} strokeWidth={2} aria-hidden="true" />}
        </div>
      </div>
    </div>
  );
}
