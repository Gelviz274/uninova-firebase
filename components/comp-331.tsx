"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  AtSign,
  Edit3,
  GraduationCap,
  ImagePlusIcon,
  Mail,
  User,
  XIcon,
} from "lucide-react";
import { db } from "@/lib/firebase/firebaseconfig";
import { doc, updateDoc } from "firebase/firestore";
//import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useImageUpload } from "@/hooks/use-image-upload";
import CTextAreaLimitCharacters from "@/components/comp-74";
import InputIconStart from "@/components/comp-09";
import Image from "next/image";

interface EditProfileUserProps {
  id: string;
  nombre: string;
  apellido: string;
  email: string;
  fotoPerfil: string;
  username: string;
  universidad: string;
  carrera: string;
  sobremi: string;
  semestre: number;
}

export default function EditProfileUser({
  id,
  nombre,
  apellido,
  email,
  fotoPerfil,
  username,
  universidad,
  carrera,
  sobremi,
  semestre,
}: EditProfileUserProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    nombres: nombre,
    apellidos: apellido,
    email: email,
    descripcion: sobremi || "",
    fotoPerfil: fotoPerfil || "",
    fotoCover: "",
    username: username || "",
    universidad: universidad || "",
    carrera: carrera || "",
    semestre: semestre || 0,
  });
  {/* 
  const handleFileChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "profile" | "cover"
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const imageRef = ref(storage, `users/${id}/${type}/${file.name}`);
      await uploadBytes(imageRef, file);
      const url = await getDownloadURL(imageRef);

      setFormData((prev) => ({
        ...prev,
        [type === "profile" ? "fotoPerfil" : "fotoCover"]: url,
      }));
    } catch (error) {
      console.error("Error al subir imagen:", error);
    }
  };
  */}

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const userRef = doc(db, "users", id);
      await updateDoc(userRef, {
        nombres: formData.nombres,
        apellidos: formData.apellidos,
        email: formData.email,
        descripcion: formData.descripcion,
        username: formData.username,
        universidad: formData.universidad,
        carrera: formData.carrera,
        semestre: formData.semestre,
        ...(formData.fotoPerfil && { photoURL: formData.fotoPerfil }),
        ...(formData.fotoCover && { fotoportada: formData.fotoCover }),
      });

      setIsOpen(false);
      window.location.reload();
    } catch (error) {
      console.error("Error al actualizar perfil:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="bg-[#202020]/60 backdrop-blur-lg border-beige/10 text-beige hover:bg-[#202020]/80 hover:text-beige transition duration-300"
        >
          <Edit3 className="w-4 h-4 mr-1" />
          Editar Perfil
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-[#202020] border-beige/10 text-beige shadow-lg rounded-lg p-0 w-auto">
        <DialogHeader>
          <DialogTitle className="px-6 py-4 text-base">
            Editar Perfil
          </DialogTitle>
        </DialogHeader>
        <div style={{ overflowY: "auto", maxHeight: "80vh" }}>
          <ProfileBg defaultImage={formData.fotoCover || "/imagenprueba.jpg"} />
          <Avatar defaultImage={formData.fotoPerfil || "/default-user.avif"} />
          <form onSubmit={handleSubmit} className="gap-6 p-4">
            {/* Sección Datos Personales */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-beige">
                Datos Personales
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <InputIconStart
                    Value={formData.nombres}
                    labeel="Nombres"
                    placeholder="Nombres"
                    type="text"
                    Icon={User}
                    onchange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        nombres: e.target.value,
                      }))
                    }
                  />
                </div>
                <div>
                  <InputIconStart
                    Value={formData.apellidos}
                    labeel="Apellidos"
                    placeholder="Apellidos"
                    type="text"
                    Icon={User}
                    onchange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        apellidos: e.target.value,
                      }))
                    }
                  />
                </div>
                <div>
                  <InputIconStart
                    Value={formData.email}
                    labeel="Correo Electrónico"
                    placeholder="Correo electrónico"
                    type="text"
                    Icon={Mail}
                    disabled={true}
                  />
                </div>
                <div>
                  <InputIconStart
                    Value={formData.username}
                    labeel="Nombre de usuario"
                    placeholder="Nombre de usuario"
                    type="text"
                    Icon={AtSign}
                    onchange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        username: e.target.value,
                      }))
                    }
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Descripción
                </label>
                <CTextAreaLimitCharacters
                  placeholder="Cuéntanos sobre ti..."
                  value={formData.descripcion}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      descripcion: e.target.value,
                    }))
                  }
                />
              </div>
            </div>

            {/* Sección Educativa */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-beige">Educación</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <InputIconStart
                    Value={formData.universidad}
                    labeel="Universidad"
                    placeholder="Universidad"
                    type="text"
                    Icon={GraduationCap}
                    onchange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        universidad: e.target.value,
                      }))
                    }
                  />
                </div>
                <div>
                  <InputIconStart
                    Value={formData.carrera}
                    labeel="Carrera"
                    placeholder="Carrera"
                    type="text"
                    Icon={GraduationCap}
                    onchange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        carrera: e.target.value,
                      }))
                    }
                  />
                </div>
                <div>
                  <InputIconStart
                    Value={formData.semestre}
                    labeel="Semestre"
                    placeholder="Semestre"
                    type="number"
                    Icon={GraduationCap}
                    onchange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        semestre: parseInt(e.target.value),
                      }))
                    }
                  />
                </div>
                {/* Botones */}
                <div className="flex justify-end gap-2 col-span-full pt-4 border-t border-beige/10">
                  {loading && <span className="loader"></span>}
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsOpen(false)}
                    className="border-beige/10 text-cafe hover:bg-white/80"
                  >
                    Cancelar
                  </Button>
                  <Button
                    type="submit"
                    disabled={loading}
                    className="bg-[#D2B48C] text-[#151515] hover:bg-[#D2B48C]/90"
                  >
                    {loading ? "Guardando..." : "Guardar Cambios"}
                  </Button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function ProfileBg({ defaultImage }: { defaultImage?: string }) {
  const [hideDefault, setHideDefault] = useState(false);
  const {
    previewUrl,
    fileInputRef,
    handleThumbnailClick,
    handleFileChange,
    handleRemove,
  } = useImageUpload();

  const currentImage = previewUrl || (!hideDefault ? defaultImage : null);

  const handleImageRemove = () => {
    handleRemove();
    setHideDefault(true);
  };

  return (
    <div className="h-40">
      <div className="bg-muted relative flex h-full w-full items-center justify-center overflow-hidden">
        {currentImage && (
          <Image
            className="h-full w-full object-cover"
            src={currentImage}
            alt={
              previewUrl
                ? "Preview of uploaded image"
                : "Default profile background"
            }
            width={512}
            height={96}
          />
        )}
        <div className="absolute inset-0 flex items-center justify-center gap-2 p-4">
          <button
            type="button"
            className="focus-visible:border-ring focus-visible:ring-ring/50 z-50 flex size-10 cursor-pointer items-center justify-center rounded-full bg-black/60 text-white transition-[color,box-shadow] outline-none hover:bg-black/80 focus-visible:ring-[3px]"
            onClick={handleThumbnailClick}
            aria-label={currentImage ? "Change image" : "Upload image"}
          >
            <ImagePlusIcon size={16} aria-hidden="true" />
          </button>
          {currentImage && (
            <button
              type="button"
              className="focus-visible:border-ring focus-visible:ring-ring/50 z-50 flex size-10 cursor-pointer items-center justify-center rounded-full bg-black/60 text-white transition-[color,box-shadow] outline-none hover:bg-black/80 focus-visible:ring-[3px]"
              onClick={handleImageRemove}
              aria-label="Remove image"
            >
              <XIcon size={16} aria-hidden="true" />
            </button>
          )}
        </div>
      </div>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        accept="image/*"
        aria-label="Upload image file"
      />
    </div>
  );
}

function Avatar({ defaultImage }: { defaultImage?: string }) {
  const { previewUrl, fileInputRef, handleThumbnailClick, handleFileChange } =
    useImageUpload();

  const currentImage = previewUrl || defaultImage;

  return (
    <div className="-mt-10 px-6">
      <div className="border-background bg-muted relative flex size-20 items-center justify-center overflow-hidden rounded-full border-4 shadow-xs shadow-black/10">
        {currentImage && (
          <Image
            src={currentImage}
            className="h-full w-full object-cover"
            width={80}
            height={80}
            alt="Profile image"
          />
        )}
        <button
          type="button"
          className="focus-visible:border-ring focus-visible:ring-ring/50 absolute flex size-8 cursor-pointer items-center justify-center rounded-full bg-black/60 text-white transition-[color,box-shadow] outline-none hover:bg-black/80 focus-visible:ring-[3px]"
          onClick={handleThumbnailClick}
          aria-label="Change profile picture"
        >
          <ImagePlusIcon size={16} aria-hidden="true" />
        </button>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
          accept="image/*"
          aria-label="Upload profile picture"
        />
      </div>
    </div>
  );
}
