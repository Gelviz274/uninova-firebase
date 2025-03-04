  import React, { useState, useEffect } from "react";
  import { getAuth, onAuthStateChanged } from "firebase/auth";
  import { getFirestore, doc, getDoc } from "firebase/firestore";
  import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
  import { Button } from "@/components/ui/button";
  import { Skeleton } from "./ui/skeleton";
  import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu";
  import {
    Bolt,
    BookOpen,
    ChevronDown,
    Layers2,
    Pin,
    UserPen,
  } from "lucide-react";
  import LogoutButton from "./LogOut";

  export default function AvatarIconDropbar() {
    const [userData, setUserData] = useState({
      nombre: "",
      apellido: "",
      email: "",
      fotoPerfil: "",
    });

    const [isLoading, setIsLoading] = useState(true);
    useEffect(() => {
      const auth = getAuth(); // Obtener instancia de auth
      const db = getFirestore();

      
      setTimeout(() => {
        setIsLoading(false);
      }, 1200); // Obtener instancia de Firestore

      // Escuchar cambios en la autenticación
      const unsubscribe = onAuthStateChanged(auth, async (user) => {
        if (user) {
          const userRef = doc(db, "users", user.uid);
          const docSnap = await getDoc(userRef);

          if (docSnap.exists()) {
            const data = docSnap.data();
            setUserData({
              nombre: data.nombre || "",
              apellido: data.apellido || "",
              email: user.email || "",
              fotoPerfil: data.fotoPerfil || "",
            });
          }
        } else {
          setUserData({ nombre: "", apellido: "", email: "", fotoPerfil: "" });
        }
      });

      return () => unsubscribe(); // Limpieza del efecto
    }, []);

    const getInitials = (nombre: string, apellido: string): string => {
      return `${nombre?.charAt(0) || ""}${apellido?.charAt(0) || ""}`.toUpperCase();
    };

    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-auto p-0 hover:bg-transparent">
            {isLoading ? (
              <Skeleton className="w-10 h-10 rounded-full" />
            ) : (
              <Avatar>
                <AvatarImage src={userData.fotoPerfil} alt="Profile image" />
                <AvatarFallback>{getInitials(userData.nombre, userData.apellido)}</AvatarFallback>
              </Avatar>
            )}
            <div className="flex text-beige gap-1 ml-2 font-bold">
              {isLoading ? (
                <Skeleton className="w-32 h-6" />
              ) : (
                <>
                  <p>{userData.nombre}</p>
                  <p>{userData.apellido}</p>
                </>
              )}
            </div>
            <ChevronDown size={16} strokeWidth={2} className="ms-2 text-beige opacity-60" aria-hidden="true" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="max-w-64 z-[100] overflow-auto bg-white shadow-md">
          <DropdownMenuLabel className="flex min-w-0 flex-col">
            {isLoading ? (
              <Skeleton className="w-full h-4 mb-1" />
            ) : (
              <span className="truncate text-sm font-medium text-foreground">
                {userData.nombre} {userData.apellido}
              </span>
            )}
            {isLoading ? (
              <Skeleton className="w-3/4 h-3" />
            ) : (
              <span className="truncate text-xs font-normal text-muted-foreground">
                {userData.email}
              </span>
            )}
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem>
              <Bolt size={16} strokeWidth={2} className="opacity-60" aria-hidden="true" />
              <span>Option 1</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Layers2 size={16} strokeWidth={2} className="opacity-60" aria-hidden="true" />
              <span>Option 2</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <BookOpen size={16} strokeWidth={2} className="opacity-60" aria-hidden="true" />
              <span>Option 3</span>
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem>
              <Pin size={16} strokeWidth={2} className="opacity-60" aria-hidden="true" />
              <span>Option 4</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <UserPen size={16} strokeWidth={2} className="opacity-60" aria-hidden="true" />
              <span>Option 5</span>
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <LogoutButton />
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }
