"use client";

import { useCharacterLimit } from "@/hooks/use-character-limit";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useId, useState, useRef, useEffect } from "react";
import { db, auth } from "@/lib/firebase/firebaseconfig";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import AlertSuccess from "./comp-271";
import InputTags from "./InputTags";


interface CreateProjectProps {
  triggerButton: React.ReactNode; // Recibe un botón como prop
}


export default function CreateProject({ triggerButton }: CreateProjectProps) {
  const id = useId();
  const maxLength = 5000;
  const {
    value: description,
    characterCount,
    handleChange,
    maxLength: limit,
  } = useCharacterLimit({ maxLength, initialValue: "" });

  const [title, setTitle] = useState("");
  const [projectLink, setProjectLink] = useState("");
  const [success, setSuccess] = useState(false);
  const [open, setOpen] = useState(false);
  const [tags, setTags] = useState<string[]>([]); 
  const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (closeTimeoutRef.current) {
        clearTimeout(closeTimeoutRef.current);
      }
    };
  }, []);

  const resetForm = () => {
    setTitle("");
    setProjectLink("");
    setTags([]); 
    setSuccess(false);
  };

  const handleCreateProject = async () => {
    if (!title.trim() || !description.trim()) {
      alert("El título y la descripción son obligatorios");
      return;
    }

    try {
      const user = auth.currentUser;
      if (!user) {
        console.error("Usuario no autenticado. No se puede crear el proyecto.");
        alert("Debes estar autenticado para crear un proyecto.");
        return;
      }

      await addDoc(collection(db, "projects"), {
        title: title.trim(),
        description: description.trim(),
        projectLink: projectLink.trim() || null, // Enlace opcional
        tags: tags, // Guardar los tags en Firebase como un array
        createdAt: serverTimestamp(),
        autorId: user.uid,
      });

      setSuccess(true);

      // Cerrar el diálogo después de 2 segundos
      closeTimeoutRef.current = setTimeout(() => {
        setOpen(false);
        resetForm();
        window.location.reload();
      }, 2000);
    } catch (error: unknown) {
      console.error("Error al crear el proyecto:", error);
      alert("Hubo un error al crear el proyecto: " + (error as Error).message);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        setOpen(isOpen);
        if (!isOpen) {
          resetForm();
        }
      }}
    >
      {success && <AlertSuccess content="Proyecto creado exitosamente" />}
      <DialogTrigger asChild>
      {triggerButton}
      </DialogTrigger>
      <DialogContent className="flex flex-col gap-0 overflow-y-visible border border-cafe/30 dark:border-beige/10 bg-white dark:bg-neutral-900 h-auto text-cafe dark:text-beige p-0 sm:max-w-lg md:max-w-2xl [&>button:last-child]:top-3.5">
        <DialogHeader className="contents space-y-0 text-left">
          <DialogTitle className="border-b border-cafe/40 dark:border-beige/10 px-6 py-4 text-cafe dark:text-beige bg-white dark:bg-neutral-900 rounded-t-xl">
            Crear Proyecto
          </DialogTitle>
        </DialogHeader>
        <DialogDescription className="sr-only">
          Crea un nuevo proyecto. Completa todos los campos para compartir tu
          idea.
        </DialogDescription>
        <div className="overflow-y-auto">
          <div className="px-6 pb-6 pt-4">
            <form className="grid grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor={`${id}-title`} className="text-cafe dark:text-beige">
                    Título del Proyecto<span className="text-red-600">*</span>
                  </Label>
                  <Input
                    id={`${id}-title`}
                    placeholder="Ingresa el título del proyecto"
                    type="text"
                    value={title}
                    className="bg-white dark:bg-neutral-900 border border-cafe/30 dark:border-beige/20 text-cafe dark:text-beige placeholder:text-cafe/70 dark:placeholder:text-beige/70 focus:border-cafe dark:focus:border-beige"
                    onChange={(e) => setTitle(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`${id}-description`} className="text-cafe dark:text-beige">
                    Descripción<span className="text-red-600">*</span>
                  </Label>
                  <Textarea
                    id={`${id}-description`}
                    placeholder="Describe brevemente tu proyecto"
                    value={description}
                    maxLength={maxLength}
                    onChange={handleChange}
                    aria-describedby={`${id}-description-count`}
                    className="bg-white dark:bg-neutral-900 border border-cafe/30 dark:border-beige/20 text-cafe dark:text-beige placeholder:text-cafe/70 dark:placeholder:text-beige/70 focus:border-cafe dark:focus:border-beige"
                    required
                  />
                  <p
                    id={`${id}-description-count`}
                    className="mt-2 text-right text-xs text-cafe/70 dark:text-muted-foreground"
                    role="status"
                    aria-live="polite"
                  >
                    <span className="tabular-nums">
                      {limit - characterCount}
                    </span>{" "}
                    caracteres restantes
                  </p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`${id}-project-link`} className="text-cafe dark:text-beige">
                    Enlace de Proyecto
                  </Label>
                  <Input
                    id={`${id}-project-link`}
                    placeholder="Agrega un enlace relacionado a tu proyecto"
                    className="bg-white dark:bg-neutral-900 border border-cafe/30 dark:border-beige/20 text-cafe dark:text-beige placeholder:text-cafe/70 dark:placeholder:text-beige/70 focus:border-cafe dark:focus:border-beige"
                    type="url"
                    value={projectLink}
                    onChange={(e) => setProjectLink(e.target.value)}
                  />
                </div>

              </div>

              {/* Segunda columna: Inputs de archivos */}
              <div className="space-y-4">
                
              <div className="space-y-2">
                  <Label htmlFor={`${id}-project-tags`} className="text-cafe dark:text-beige">
                    Tags del proyecto
                  </Label>
                  <span className="text-red-500">*</span>
                  <InputTags onChange={setTags} />
                </div>
                                {/* Imágenes */}
                                <div className="space-y-2">
                  <Label htmlFor={`${id}-image`} className="text-cafe dark:text-beige">
                    Subir Imágenes
                  </Label>
                  <Input
                    id={`${id}-image`}
                    type="file"
                    accept="image/*"
                    className="bg-white dark:bg-neutral-900 border border-cafe/30 dark:border-beige/20 text-cafe dark:text-beige file:cursor-pointer file:rounded-lg file:border-none file:bg-cafe/10 dark:file:bg-beige/20 file:px-3 file:py-2 file:text-cafe dark:file:text-beige hover:file:bg-cafe/20 dark:hover:file:bg-beige/30"
                  />
                </div>

                {/* Videos */}
                <div className="space-y-2">
                  <Label htmlFor={`${id}-video`} className="text-cafe dark:text-beige">
                    Subir Video
                  </Label>
                  <Input
                    id={`${id}-video`}
                    type="file"
                    accept="video/*"
                    className="bg-white dark:bg-neutral-900 border border-cafe/30 dark:border-beige/20 text-cafe dark:text-beige file:cursor-pointer file:rounded-lg file:border-none file:bg-cafe/10 dark:file:bg-beige/20 file:px-3 file:py-2 file:text-cafe dark:file:text-beige hover:file:bg-cafe/20 dark:hover:file:bg-beige/30"
                  />
                </div>

                {/* Documentos */}
                <div className="space-y-2">
                  <Label htmlFor={`${id}-document`} className="text-cafe dark:text-beige">
                    Subir Documento
                  </Label>
                  <Input
                    id={`${id}-document`}
                    type="file"
                    accept=".pdf,.doc,.docx"
                    className="bg-white dark:bg-neutral-900 border border-cafe/30 dark:border-beige/20 text-cafe dark:text-beige file:cursor-pointer file:rounded-lg file:border-none file:bg-cafe/10 dark:file:bg-beige/20 file:px-3 file:py-2 file:text-cafe dark:file:text-beige hover:file:bg-cafe/20 dark:hover:file:bg-beige/30"
                  />
                </div>
                
              </div>
            </form>
          </div>
        </div>

        <DialogFooter className="border-t border-cafe/40 dark:border-beige/40 px-6 py-4 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-sm">
          <DialogClose asChild>
            <Button type="button" variant="outline" className="text-cafe hover:bg-cafe/5 dark:hover:bg-beige/5 border-cafe/30 dark:border-beige/30">
              Cancelar
            </Button>
          </DialogClose>
          <Button
            type="button"
            onClick={handleCreateProject}
            className="bg-cafe/90 hover:bg-cafe text-white dark:bg-beige/30 dark:hover:bg-beige/40 dark:text-beige"
          >
            Guardar Proyecto
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
