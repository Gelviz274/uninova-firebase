'use client';

import { ReactNode } from 'react';
import { useParams } from 'next/navigation';

interface LayoutProps {
  children: ReactNode;
}

const UserLayout = ({ children }: LayoutProps) => {
  const params = useParams();
  const username = params.username as string;

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4">
      <header className="bg-gray-800 p-4 rounded-md shadow-md text-center">
        <h1 className="text-2xl font-bold">Perfil de @{username}</h1>
      </header>
      <main className="mt-4">{children}</main>
    </div>
  );
};

export default UserLayout;
