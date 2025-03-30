'use client';

import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Skeleton } from "./ui/skeleton";
import { useRouter } from "next/navigation";
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
  ChevronDown,
  HelpCircle,
  Pin,
  Search,
  User2,
  BookOpen,
  Moon,
  Sun,
} from "lucide-react";
import LogoutButton from "./LogOut";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "next-themes";


export default function AvatarIconDropbar() {
  const { userProfile, loading } = useAuth();
  const { theme, setTheme } = useTheme();
  const router = useRouter();
  const getInitials = (nombre: string, apellidos: string): string => {
    return `${nombre?.charAt(0) || ""}${
      apellidos?.charAt(0) || ""
    }`.toUpperCase();
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-auto p-0 hover:bg-transparent">
          {loading ? (
            <Skeleton className="w-10 h-10 rounded-full" />
          ) : (
            <Avatar>
              <AvatarImage src={userProfile?.photoURL} alt="Profile image" />
              <AvatarFallback className="bg-gray-200 text-gray-800 dark:bg-neutral-700 dark:text-beige">
                {userProfile && getInitials(userProfile.nombres, userProfile.apellidos)}
              </AvatarFallback>
            </Avatar>
          )}
          <div className="flex text-gray-800 dark:text-beige gap-1 ml-2 font-bold transition-colors">
            {loading ? (
              <Skeleton className="w-32 h-6" />
            ) : (
              <>
                <p>{userProfile?.nombres}</p>
                <p>{userProfile?.apellidos}</p>
              </>
            )}
          </div>
          <ChevronDown
            size={16}
            strokeWidth={2}
            className="ms-2 text-gray-600 dark:text-beige opacity-60"
            aria-hidden="true"
          />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="max-w-64 z-[100] overflow-auto bg-white dark:bg-neutral-800 shadow-md dark:border-neutral-700">
        <DropdownMenuLabel className="flex min-w-0 flex-col">
          {loading ? (
            <Skeleton className="w-full h-4 mb-1" />
          ) : (
            <span className="truncate text-sm font-medium text-gray-800 dark:text-beige">
              {userProfile?.nombres} {userProfile?.apellidos}
            </span>
          )}
          {loading ? (
            <Skeleton className="w-3/4 h-3" />
          ) : (
            <span className="truncate text-xs font-normal text-gray-600 dark:text-gray-300">
              {userProfile?.email}
            </span>
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-gray-200 dark:bg-neutral-700" />
        <DropdownMenuGroup>
          <DropdownMenuItem 
          onClick={() => router.push(`/${userProfile?.username}`)}
          className="text-gray-800 dark:text-beige focus:bg-gray-100 dark:focus:bg-neutral-700 cursor-pointer">
            <div
              className="flex items-center gap-2"
            >
              <User2
                size={16}
                strokeWidth={2}
                className="opacity-60"
                aria-hidden="true"
              />
              <span>Ver Perfil</span>
            </div>
          </DropdownMenuItem>
          <DropdownMenuItem className="text-gray-800 dark:text-beige focus:bg-gray-100 dark:focus:bg-neutral-700">
            <Search
              size={16}
              strokeWidth={2}
              className="opacity-60"
              aria-hidden="true"
            />
            <span>Buscar</span>
          </DropdownMenuItem>
          <DropdownMenuItem className="text-gray-800 dark:text-beige focus:bg-gray-100 dark:focus:bg-neutral-700">
            <BookOpen
              size={16}
              strokeWidth={2}
              className="opacity-60"
              aria-hidden="true"
            />
            <span>Option 3</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator className="bg-gray-200 dark:bg-neutral-700" />
        <DropdownMenuGroup>
          <DropdownMenuItem 
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="text-gray-800 dark:text-beige focus:bg-gray-100 dark:focus:bg-neutral-700 cursor-pointer"
          >
            {theme === 'dark' ? (
              <Sun
                size={16}
                strokeWidth={2}
                className="opacity-60"
                aria-hidden="true"
              />
            ) : (
              <Moon
                size={16}
                strokeWidth={2}
                className="opacity-60"
                aria-hidden="true"
              />
            )}
            <span>{theme === 'dark' ? 'Modo Claro' : 'Modo Oscuro'}</span>
          </DropdownMenuItem>
          <DropdownMenuItem className="text-gray-800 dark:text-beige focus:bg-gray-100 dark:focus:bg-neutral-700">
            <Pin
              size={16}
              strokeWidth={2}
              className="opacity-60"
              aria-hidden="true"
            />
            <span>Option 4</span>
          </DropdownMenuItem>
          <DropdownMenuItem className="text-gray-800 dark:text-beige focus:bg-gray-100 dark:focus:bg-neutral-700">
            <HelpCircle
              size={16}
              strokeWidth={2}
              className="opacity-60"
              aria-hidden="true"
            />
            <span>Ayuda y Soporte</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator className="bg-gray-200 dark:bg-neutral-700" />
        <DropdownMenuItem className="text-gray-800 dark:text-beige focus:bg-gray-100 dark:focus:bg-neutral-700">
          <LogoutButton />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
