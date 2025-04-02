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
  Value?: string | number;
  required?: boolean;
  disabled?: boolean;
}

export default function InputIconStart({ labeel,  placeholder, type, Icon,Value,onchange, required, disabled }: InputProps) {
  const id = useId();
  return (
    <div className="space-y-2">
      <Label className="text-neutral-900 dark:text-beige font-medium flex items-center gap-1" htmlFor={id}>
        {labeel}
        {required && <span className="text-destructive">*</span>}
      </Label>
      <div className="relative">
        <Input id={id} 
        className="peer ps-9 bg-white dark:bg-black/40 border border-neutral-300 dark:border-beige/20 focus:border-neutral-500 dark:focus:border-beige rounded-md py-6 text-neutral-900 dark:text-beige group-focus-within:border-neutral-500 dark:group-focus-within:border-beige" 
        onChange={onchange} 
        placeholder={placeholder} 
        type={type} 
        value={Value}
        required={required} // Asegura que el input realmente sea obligatorio
        disabled={disabled}
        />
        <div className="pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 text-neutral-700 dark:text-beige/80 peer-disabled:opacity-50">
          {Icon && <Icon size={16} strokeWidth={2} aria-hidden="true" />}
        </div>
      </div>
    </div>
  );
}
