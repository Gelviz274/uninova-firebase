import { Input } from "@/components/ui/input";
import { LucideIcon } from "lucide-react";

interface InputWithIconProps {
  id?: string;
  type?: string;
  placeholder?: string;
  Icon?: LucideIcon;
  className?: string;
  disabled?: boolean;
  Value?: string | number;
  onchange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function InputWhitIconEnd({ id, type = "text", placeholder, Icon, className, disabled, Value, onchange }: InputWithIconProps) {
  return (
    <div className="space-y-2">
      <div className="relative">
        <Input id={id} 
        className={className} 
        placeholder={placeholder} 
        disabled={disabled}
        type={type} 
        value={Value}
        onChange={onchange}
        />
        <div className="pointer-events-none absolute inset-y-0 end-0 flex items-center justify-center pe-5 transition-colors group-focus-within:text-cafe">
        {Icon && <Icon className="absolute text-beige/80 h-4 w-4 transition-colors group-focus-within:text-beige" />}
        </div>
      </div>
    </div>
  );
}
