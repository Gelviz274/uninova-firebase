"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Edit3 } from "lucide-react";
import { db, storage } from "@/lib/firebase/firebaseconfig";
import { doc, updateDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import Image from "next/image";

interface EditProfileUserProps {
  id: string;
  nombre: string;
  apellido: string;
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
  fotoPerfil,
  username,
  universidad,
  carrera,
  sobremi,
  semestre
}: EditProfileUserProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    nombres: nombre,
    apellidos: apellido,
    descripcion: sobremi || "",
    fotoPerfil: fotoPerfil || "",
    fotoCover: "",
    username: username || "",
    universidad: universidad || "",
    carrera: carrera || "",
    semestre: semestre || 0
  });

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>, type: 'profile' | 'cover') => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const imageRef = ref(storage, `users/${id}/${type}/${file.name}`);
      await uploadBytes(imageRef, file);
      const url = await getDownloadURL(imageRef);
      
      setFormData(prev => ({
        ...prev,
        [type === 'profile' ? 'fotoPerfil' : 'fotoCover']: url
      }));
    } catch (error) {
      console.error("Error al subir imagen:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const userRef = doc(db, "users", id);
      await updateDoc(userRef, {
        nombres: formData.nombres,
        apellidos: formData.apellidos,
        descripcion: formData.descripcion,
        username: formData.username,
        universidad: formData.universidad,
        carrera: formData.carrera,
        semestre: formData.semestre,
        ...(formData.fotoPerfil && { photoURL: formData.fotoPerfil }),
        ...(formData.fotoCover && { fotoportada: formData.fotoCover })
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
          className="bg-[#202020]/60 backdrop-blur-lg border-beige/10 text-beige hover:bg-[#202020]/80 hover:text-beige"
        >
          <Edit3 className="w-4 h-4 mr-2" />
          Editar Perfil
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-[#202020] border-beige/10 text-beige">
        <DialogHeader>
          <DialogTitle>Editar Perfil</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Foto de Perfil</label>
              <div className="flex items-center gap-4">
                {formData.fotoPerfil && (
                  <Image
                    src={formData.fotoPerfil}
                    alt="Foto de perfil"
                    width={64}
                    height={64}
                    className="rounded-full object-cover"
                  />
                )}
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileChange(e, 'profile')}
                  className="bg-[#151515]"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Foto de Portada</label>
              <div className="flex items-center gap-4">
                {formData.fotoCover && (
                  <Image
                    src={formData.fotoCover}
                    alt="Foto de portada"
                    width={120}
                    height={40}
                    className="rounded object-cover"
                  />
                )}
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileChange(e, 'cover')}
                  className="bg-[#151515]"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Nombres</label>
              <Input
                value={formData.nombres}
                onChange={(e) => setFormData(prev => ({ ...prev, nombres: e.target.value }))}
                className="bg-[#151515]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Apellidos</label>
              <Input
                value={formData.apellidos}
                onChange={(e) => setFormData(prev => ({ ...prev, apellidos: e.target.value }))}
                className="bg-[#151515]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Descripción</label>
              <Textarea
                value={formData.descripcion}
                onChange={(e) => setFormData(prev => ({ ...prev, descripcion: e.target.value }))}
                className="bg-[#151515] min-h-[100px]"
                placeholder="Cuéntanos sobre ti..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Username</label>
              <Input
                value={formData.username}
                onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}
                className="bg-[#151515]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Universidad</label>
              <Input
                value={formData.universidad}
                onChange={(e) => setFormData(prev => ({ ...prev, universidad: e.target.value }))}
                className="bg-[#151515]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Carrera</label>
              <Input
                value={formData.carrera}
                onChange={(e) => setFormData(prev => ({ ...prev, carrera: e.target.value }))}
                className="bg-[#151515]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Semestre</label>
              <Input
                type="number"
                value={formData.semestre}
                onChange={(e) => setFormData(prev => ({ ...prev, semestre: parseInt(e.target.value) }))}
                className="bg-[#151515]"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
              className="border-beige/10 text-beige hover:bg-beige/5"
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
        </form>
      </DialogContent>
    </Dialog>
  );
}
