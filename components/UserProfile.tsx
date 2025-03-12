'use client';

import { useAuth } from '@/contexts/AuthContext';
import Image from 'next/image';

export default function UserProfile() {
  const { userProfile, loading } = useAuth();

  if (loading) {
    return <div>Cargando...</div>;
  }

  if (!userProfile) {
    return <div>Por favor inicia sesión</div>;
  }

  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-4">Perfil de Usuario</h2>
      <div className="space-y-2">
        <p><span className="font-semibold">Email:</span> {userProfile.email}</p>
        <p><span className="font-semibold">Usuario:</span> {userProfile.username}</p>
        <p><span className="font-semibold">Nombres:</span> {userProfile.nombres}</p>
        <p><span className="font-semibold">Apellidos:</span> {userProfile.apellidos}</p>
        <p><span className="font-semibold">Carrera:</span> {userProfile.carrera}</p>
        {userProfile.photoURL && (
          <div className="mt-4">
            <Image
              src={userProfile.photoURL || "/default-user.avif"}
              alt="Foto de perfil"
              width={40}
              height={40}
              className="rounded-full object-cover"
              priority
            />
          </div>
        )}
      </div>
    </div>
  );
}
