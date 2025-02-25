import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useId } from "react";

interface TextAreaOptionalProps {
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  Labeel?: string;
}

export default function TextAreaOptional({ placeholder, value, onChange, Labeel }: TextAreaOptionalProps) {
  const id = useId();
  return (
    <div
      className="space-y-2"
      // NOTE: This inline style is to show how to set the --ring variable in your CSS file in order to change the focus ring color.
      style={{ "--ring": "234 89% 74%" } as React.CSSProperties}
    >
      <Label className="text-beige/80"  
      htmlFor={id}>{Labeel}</Label>
      <Textarea id={id} 
      className="w-full  bg-black/40 p-3 border border-beige/10 rounded-md text-beige  group-focus-within:text-beige"
      placeholder={placeholder}
      value={value}
      onChange={onChange} />
    </div>
  );
}
