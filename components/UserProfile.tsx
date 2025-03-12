'use client';

import { useAuth } from '@/contexts/AuthContext';

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
            <img 
              src={userProfile.photoURL} 
              alt="Foto de perfil"
              className="w-24 h-24 rounded-full object-cover" 
            />
          </div>
        )}
      </div>
    </div>
  );
}
