'use client';

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase/firebaseconfig";
import { collection, query, where, getDocs, addDoc, serverTimestamp, deleteDoc } from "firebase/firestore";
import { notFound } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loading } from "@/components/ui/loading";
import ListaProyectos from "@/components/utils/Projects";
import { Book, Award, Users2, Briefcase, UserPlus, UserMinus } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { use } from "react";
import MyProjects from "@/components/utils/MyProjects";

interface UserData {
  id: string;
  nombres: string;
  apellidos: string;
  username: string;
  universidad: string;
  carrera: string;
  semestre: string;
  descripcion: string;
  photoURL: string;
  seguidores: number;
  siguiendo: number;
  proyectos: number;
  intereses: string[];
  logros: string[];
  experiencia: {
    titulo: string;
    empresa: string;
    periodo: string;
  }[];
}

export default function UserProfile({ params }: { params: Promise<{ username: string }> }) {
  const { username } = use(params);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const usersRef = collection(db, "users");
        const q = query(usersRef, where("username", "==", username));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
          notFound();
          return;
        }

        const data = querySnapshot.docs[0].data() as Omit<UserData, 'id'>;
        setUserData({
          ...data,
          id: querySnapshot.docs[0].id
        });
        
        if (user) {
          const followingRef = collection(db, "follows");
          const followQuery = query(
            followingRef,
            where("followerId", "==", user.uid),
            where("followingId", "==", querySnapshot.docs[0].id)
          );
          const followSnapshot = await getDocs(followQuery);
          setIsFollowing(!followSnapshot.empty);
        }
        
        setLoading(false);
      } catch (error) {
        console.error("Error al obtener datos del usuario:", error);
        notFound();
      }
    };

    fetchUserData();
  }, [username, user]);

  const handleFollow = async () => {
    if (!user) {
      router.push('/auth/');
      return;
    }

    try {
      if (!userData) return;

      const followsRef = collection(db, "follows");
      
      if (isFollowing) {
        const unfollow = query(
          followsRef,
          where("followerId", "==", user.uid),
          where("followingId", "==", userData.id)
        );
        const unfollowSnapshot = await getDocs(unfollow);
        if (!unfollowSnapshot.empty) {
          await deleteDoc(unfollowSnapshot.docs[0].ref);
          setIsFollowing(false);
          setUserData(prev => prev ? {
            ...prev,
            seguidores: (prev.seguidores || 0) - 1
          } : null);
        }
      } else {
        await addDoc(followsRef, {
          followerId: user.uid,
          followingId: userData.id,
          createdAt: serverTimestamp()
        });
        setIsFollowing(true);
        setUserData(prev => prev ? {
          ...prev,
          seguidores: (prev.seguidores || 0) + 1
        } : null);
      }
    } catch (error) {
      console.error("Error al actualizar seguimiento:", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[600px] flex items-center justify-center">
        <Loading size="lg" />
      </div>
    );
  }

  if (!userData) return null;

  const isOwnProfile = user?.email === userData.username;

  return (
    <div className="py-8">
      {/* Grid de estadísticas */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-[#202020]/50 backdrop-blur-sm p-4 rounded-2xl border border-beige/5 hover:border-beige/10 transition-all">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-[#D2B48C]/10 rounded-xl">
              <Users2 className="text-[#D2B48C] w-5 h-5" />
            </div>
            <div>
              <p className="text-sm text-beige/60">Seguidores</p>
              <p className="text-xl font-bold text-beige">{userData.seguidores || 0}</p>
            </div>
          </div>
        </div>
        <div className="bg-[#202020]/50 backdrop-blur-sm p-4 rounded-2xl border border-beige/5 hover:border-beige/10 transition-all">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-[#D2B48C]/10 rounded-xl">
              <Users2 className="text-[#D2B48C] w-5 h-5" />
            </div>
            <div>
              <p className="text-sm text-beige/60">Siguiendo</p>
              <p className="text-xl font-bold text-beige">{userData.siguiendo || 0}</p>
            </div>
          </div>
        </div>
        <div className="bg-[#202020]/50 backdrop-blur-sm p-4 rounded-2xl border border-beige/5 hover:border-beige/10 transition-all">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-[#D2B48C]/10 rounded-xl">
              <Book className="text-[#D2B48C] w-5 h-5" />
            </div>
            <div>
              <p className="text-sm text-beige/60">Proyectos</p>
              <p className="text-xl font-bold text-beige">{userData.proyectos || 0}</p>
            </div>
          </div>
        </div>
        <div className="bg-[#202020]/50 backdrop-blur-sm p-4 rounded-2xl border border-beige/5 hover:border-beige/10 transition-all">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-[#D2B48C]/10 rounded-xl">
              <Award className="text-[#D2B48C] w-5 h-5" />
            </div>
            <div>
              <p className="text-sm text-beige/60">Logros</p>
              <p className="text-xl font-bold text-beige">{userData.logros?.length || 0}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Descripción y botón de seguir */}
      <div className="mb-8">
        {userData.descripcion && (
          <div className="bg-[#202020]/50 backdrop-blur-sm p-6 rounded-2xl border border-beige/5 mb-4">
            <p className="text-beige/80 leading-relaxed whitespace-pre-line">{userData.descripcion}</p>
          </div>
        )}
        
        {!isOwnProfile && (
          <Button
            onClick={handleFollow}
            className={`w-full md:w-auto ${
              isFollowing 
                ? "bg-red-500/10 hover:bg-red-500/20 text-red-500 border-red-500/20" 
                : "bg-[#D2B48C]/10 hover:bg-[#D2B48C]/20 text-[#D2B48C] border-[#D2B48C]/20"
            } border px-8 py-6 rounded-2xl transition-all duration-300`}
          >
            {isFollowing ? (
              <>
                <UserMinus className="w-5 h-5 mr-2" />
                Dejar de Seguir
              </>
            ) : (
              <>
                <UserPlus className="w-5 h-5 mr-2" />
                Seguir
              </>
            )}
          </Button>
        )}
      </div>

      {/* Intereses */}
      {userData.intereses && userData.intereses.length > 0 && (
        <div className="mb-8 bg-[#202020]/50 backdrop-blur-sm p-6 rounded-2xl border border-beige/5">
          <h3 className="text-lg font-semibold text-beige mb-4">Intereses</h3>
          <div className="flex flex-wrap gap-2">
            {userData.intereses.map((interes, index) => (
              <span
                key={index}
                className="px-4 py-2 bg-[#D2B48C]/10 text-[#D2B48C] rounded-xl text-sm font-medium border border-[#D2B48C]/20"
              >
                {interes}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Tabs de contenido */}
      <Tabs defaultValue="proyectos" className="w-full">
        <TabsList className="w-full flex space-x-1 bg-[#202020]/50 backdrop-blur-sm p-1 rounded-2xl border border-beige/5 mb-6">
          <TabsTrigger 
            value="proyectos" 
            className="flex-1 py-3 data-[state=active]:bg-[#D2B48C] data-[state=active]:text-[#202020] rounded-xl transition-all"
          >
            Proyectos
          </TabsTrigger>
          <TabsTrigger 
            value="experiencia" 
            className="flex-1 py-3 data-[state=active]:bg-[#D2B48C] data-[state=active]:text-[#202020] rounded-xl transition-all"
          >
            Experiencia
          </TabsTrigger>
          <TabsTrigger 
            value="logros" 
            className="flex-1 py-3 data-[state=active]:bg-[#D2B48C] data-[state=active]:text-[#202020] rounded-xl transition-all"
          >
            Logros
          </TabsTrigger>
        </TabsList>

        <TabsContent value="proyectos">
          {isOwnProfile ? <MyProjects /> : <ListaProyectos userId={userData.id} />}
        </TabsContent>

        <TabsContent value="experiencia">
          <div className="bg-[#202020]/50 backdrop-blur-sm rounded-2xl border border-beige/5 p-6">
            {userData.experiencia && userData.experiencia.length > 0 ? (
              <div className="space-y-6">
                {userData.experiencia.map((exp, index) => (
                  <div key={index} className="flex items-start gap-4 p-6 bg-[#1a1a1a]/50 rounded-xl border border-beige/5 hover:border-beige/10 transition-all">
                    <div className="p-3 bg-[#D2B48C]/10 rounded-xl">
                      <Briefcase className="text-[#D2B48C] w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-beige">{exp.titulo}</h3>
                      <p className="text-beige/80 text-lg mt-1">{exp.empresa}</p>
                      <p className="text-beige/60 mt-2">{exp.periodo}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Briefcase className="mx-auto text-beige/20 w-12 h-12 mb-4" />
                <p className="text-beige/60 text-lg">No hay experiencia registrada</p>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="logros">
          <div className="bg-[#202020]/50 backdrop-blur-sm rounded-2xl border border-beige/5 p-6">
            {userData.logros && userData.logros.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {userData.logros.map((logro, index) => (
                  <div key={index} className="flex items-start gap-4 p-6 bg-[#1a1a1a]/50 rounded-xl border border-beige/5 hover:border-beige/10 transition-all">
                    <div className="p-3 bg-[#D2B48C]/10 rounded-xl">
                      <Award className="text-[#D2B48C] w-6 h-6" />
                    </div>
                    <div className="flex-grow">
                      <p className="text-beige/80 text-lg">{logro}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Award className="mx-auto text-beige/20 w-12 h-12 mb-4" />
                <p className="text-beige/60 text-lg">No hay logros registrados</p>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
