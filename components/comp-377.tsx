'use client';

import React from "react";
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
  ChevronDown,
  HelpCircle,
  Pin,
  Search,
  User2,
  BookOpen,
} from "lucide-react";
import LogoutButton from "./LogOut";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";

export default function AvatarIconDropbar() {
  const { userProfile, loading } = useAuth();

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
              <AvatarFallback>
                {userProfile && getInitials(userProfile.nombres, userProfile.apellidos)}
              </AvatarFallback>
            </Avatar>
          )}
          <div className="flex text-beige gap-1 ml-2 font-bold">
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
            className="ms-2 text-beige opacity-60"
            aria-hidden="true"
          />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="max-w-64 z-[100] overflow-auto bg-white shadow-md">
        <DropdownMenuLabel className="flex min-w-0 flex-col">
          {loading ? (
            <Skeleton className="w-full h-4 mb-1" />
          ) : (
            <span className="truncate text-sm font-medium text-foreground">
              {userProfile?.nombres} {userProfile?.apellidos}
            </span>
          )}
          {loading ? (
            <Skeleton className="w-3/4 h-3" />
          ) : (
            <span className="truncate text-xs font-normal text-muted-foreground">
              {userProfile?.email}
            </span>
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <Link
              href={`/${userProfile?.username}`}
              className="flex items-center gap-2"
            >
              <User2
                size={16}
                strokeWidth={2}
                className="opacity-60"
                aria-hidden="true"
              />
              <span>Ver Perfil</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Search
              size={16}
              strokeWidth={2}
              className="opacity-60"
              aria-hidden="true"
            />
            <span>Buscar</span>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <BookOpen
              size={16}
              strokeWidth={2}
              className="opacity-60"
              aria-hidden="true"
            />
            <span>Option 3</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <Pin
              size={16}
              strokeWidth={2}
              className="opacity-60"
              aria-hidden="true"
            />
            <span>Option 4</span>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <HelpCircle
              size={16}
              strokeWidth={2}
              className="opacity-60"
              aria-hidden="true"
            />
            <span>Ayuda y Soporte</span>
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
