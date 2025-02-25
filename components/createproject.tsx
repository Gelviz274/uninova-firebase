"use client";

import { useCharacterLimit } from "@/hooks/use-character-limit";
import { useImageUpload } from "@/hooks/use-image-upload";
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
import { Check, ImagePlus, X } from "lucide-react";
import { useId, useState } from "react";
import { db, auth } from "@/lib/firebase/firebaseconfig";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

export default function CreateProject() {
  const id = useId();
  const maxLength = 180;
  const {
    value,
    characterCount,
    handleChange,
    maxLength: limit,
  } = useCharacterLimit({ maxLength, initialValue: "" });

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [projectLink, setProjectLink] = useState("");
  const { previewUrl } = useImageUpload();

  const handleCreateProject = async () => {
    if (!title || !description) {
      alert("El título y la descripción son obligatorios");
      return;
    }
    const user = auth.currentUser;
    if (!user) {
      alert("Debes estar autenticado para crear un proyecto");
      return;
    }
    try {
      await addDoc(collection(db, "projects"), {
        title,
        description,
        projectLink,
        imageUrl: previewUrl || "",
        createdAt: serverTimestamp(),
        autorId: user.uid,
      });
      alert("Proyecto creado exitosamente");
      setTitle("");
      setDescription("");
      setProjectLink("");
    } catch (error) {
      console.error("Error al crear el proyecto:", error);
      alert("Hubo un error al crear el proyecto");
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="w-full bg-cafe/60 text-beige/40 text-start px-4 py-4 rounded-full">
          ¿Qué estás pensando?
        </button>
      </DialogTrigger>
      <DialogContent className="flex flex-col gap-0 overflow-y-visible border border-beige/50 bg-[#0b0b0b] text-beige p-0 sm:max-w-lg md:max-w-2xl [&>button:last-child]:top-3.5">
        <DialogHeader className="contents space-y-0 text-left">
          <DialogTitle className="border-b border-beige/40 px-6 py-4 text-base bg-cafe rounded-t-xl">
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
              {/* Primera columna */}
              <div className="space-y-4">
                {/* Título del Proyecto */}
                <div className="space-y-2">
                  <Label htmlFor={`${id}-title`} className="text-beige">
                    Título del Proyecto<span className="text-red-600">*</span>
                  </Label>
                  <Input
                    id={`${id}-title`}
                    placeholder="Ingresa el título del proyecto"
                    type="text"
                    value={title}
                    className="bg-black border border-beige/20 text-beige placeholder-text-beige focus:border-beige"
                    onChange={(e) => setTitle(e.target.value)}
                    required
                  />
                </div>

                {/* Descripción */}
                <div className="space-y-2">
                  <Label htmlFor={`${id}-description`} className="text-beige">
                    Descripción<span className="text-red-600">*</span>
                  </Label>
                  <Textarea
                    id={`${id}-description`}
                    placeholder="Describe brevemente tu proyecto"
                    value={description}
                    maxLength={maxLength}
                    onChange={(e) => {
                      handleChange(e);
                      setDescription(e.target.value);
                    }}
                    aria-describedby={`${id}-description-count`}
                    className="bg-black border border-beige/20 text-beige placeholder-text-beige focus:border-beige"
                    required
                  />
                  <p
                    id={`${id}-description-count`}
                    className="mt-2 text-right text-xs text-muted-foreground"
                    role="status"
                    aria-live="polite"
                  >
                    <span className="tabular-nums">
                      {limit - characterCount}
                    </span>{" "}
                    caracteres restantes
                  </p>
                </div>

                {/* Enlace de video o documentos */}
                <div className="space-y-2">
                  <Label htmlFor={`${id}-project-link`} className="text-beige">
                    Enlace de Proyecto
                  </Label>
                  <Input
                    id={`${id}-project-link`}
                    placeholder="Agrega un enlace relacionado a tu proyecto"
                    className="bg-black border border-beige/20 text-beige placeholder-text-beige focus:border-beige"
                    type="url"
                    value={projectLink}
                    onChange={(e) => setProjectLink(e.target.value)}
                  />
                </div>

                {/* Tags */}
                <div className="space-y-2">
                  <Label htmlFor={`${id}-tags`} className="text-beige">
                    Tags de Carreras
                  </Label>
                  <Input
                    id={`${id}-tags`}
                    placeholder="Ingresa las tags separadas por comas"
                    className="bg-black border border-beige/20 text-beige placeholder-text-beige focus:border-beige"
                    type="text"
                  />
                </div>
              </div>

              {/* Segunda columna: Inputs de archivos */}
              <div className="space-y-4">
                {/* Imágenes */}
                <div className="space-y-2">
                  <Label htmlFor={`${id}-image`} className="text-beige">
                    Subir Imágenes
                  </Label>
                  <Input
                    id={`${id}-image`}
                    type="file"
                    accept="image/*"
                    className="bg-black border border-beige/20 text-beige file:cursor-pointer file:rounded-lg file:border-none file:bg-beige/20 file:px-3 file:py-2 file:text-beige hover:file:bg-beige/30"
                    
                  />
                </div>

                {/* Videos */}
                <div className="space-y-2">
                  <Label htmlFor={`${id}-video`} className="text-beige">
                    Subir Video
                  </Label>
                  <Input
                    id={`${id}-video`}
                    type="file"
                    accept="video/*"
                    className="bg-black border border-beige/20 text-beige file:cursor-pointer file:rounded-lg file:border-none file:bg-beige/20 file:px-3 file:py-2 file:text-beige hover:file:bg-beige/30"
                    
                  />
                </div>

                {/* Documentos */}
                <div className="space-y-2">
                  <Label htmlFor={`${id}-document`} className="text-beige">
                    Subir Documento
                  </Label>
                  <Input
                    id={`${id}-document`}
                    type="file"
                    accept=".pdf,.doc,.docx"
                    className="bg-black border border-beige/20 text-beige file:cursor-pointer file:rounded-lg file:border-none file:bg-beige/20 file:px-3 file:py-2 file:text-beige hover:file:bg-beige/30"
                    
                  />
                </div>
              </div>
            </form>
          </div>
        </div>

        <DialogFooter className="border-t border-beige/40 px-6 py-4">
          <DialogClose asChild>
            <Button type="button" variant="outline" className="text-cafe">
              Cancelar
            </Button>
          </DialogClose>
          <Button
            type="button"
            onClick={handleCreateProject}
            className="text-beige"
          >
            Guardar Proyecto
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
