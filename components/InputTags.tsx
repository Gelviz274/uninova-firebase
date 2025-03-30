import { useState } from "react";
import MultipleSelector, { Option } from "@/components/ui/multiselect";

const careers: Option[] = [
  { value: "Administración de Empresas", label: "Administración de Empresas" },
  { value: "Arquitectura", label: "Arquitectura" },
  { value: "Biología", label: "Biología" },
  { value: "Ciencias Políticas", label: "Ciencias Políticas" },
  { value: "Comunicación Social", label: "Comunicación Social" },
  { value: "Contaduría Pública", label: "Contaduría Pública" },
  { value: "Derecho", label: "Derecho" },
  { value: "Diseño Gráfico", label: "Diseño Gráfico" },
  { value: "Economía", label: "Economía" },
  { value: "Enfermería", label: "Enfermería" },
  { value: "Ingeniería Civil", label: "Ingeniería Civil" },
  { value: "Ingeniería Electrónica", label: "Ingeniería Electrónica" },
  { value: "Ingeniería Informática", label: "Ingeniería Informática" },
  { value: "Ingeniería Industrial", label: "Ingeniería Industrial" },
  { value: "Ingeniería Mecánica", label: "Ingeniería Mecánica" },
  { value: "Ingeniería de Sistemas", label: "Ingeniería de Sistemas" },
  { value: "Medicina", label: "Medicina" },
  { value: "Psicología", label: "Psicología" },
];

interface InputTagsProps {
  onChange: (selectedTags: string[]) => void;
}

export default function InputTags({ onChange }: InputTagsProps) {
  const [selectedOptions, setSelectedOptions] = useState<Option[]>([]);

  const handleSelectionChange = (options: Option[]) => {
    setSelectedOptions(options);
    onChange(options.map((opt) => opt.value)); // Enviar solo los valores seleccionados
  };

  return (
    <MultipleSelector
      defaultOptions={careers}
      selected={selectedOptions}
      onChange={handleSelectionChange}
      placeholder="Selecciona la carrera"
      className="border border-cafe/30 dark:border-beige/20 bg-white dark:bg-neutral-900 text-cafe dark:text-beige"
      hideClearAllButton
      hidePlaceholderWhenSelected
      emptyIndicator={<p className="text-center text-sm text-cafe/70 dark:text-beige/70">No results found</p>}
    />
  );
}
