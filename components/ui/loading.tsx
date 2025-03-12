'use client';

import { cn } from "@/lib/utils";

interface LoadingProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'minimal';
}

export function Loading({ className, size = 'md', variant = 'default' }: LoadingProps) {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };

  if (variant === 'minimal') {
    return (
      <div className={cn("flex items-center justify-center", className)}>
        <div className={cn(
          "border-t-2 border-[#D2B48C] rounded-full animate-spin",
          sizeClasses[size]
        )} />
      </div>
    );
  }

  return (
    <div className={cn("flex flex-col items-center justify-center gap-4 min-h-[200px]", className)}>
      <div className="relative">
        <div className={cn(
          "border-4 border-[#D2B48C]/30 rounded-full",
          sizeClasses[size]
        )} />
        <div className={cn(
          "border-4 border-t-[#D2B48C] rounded-full animate-spin absolute top-0",
          sizeClasses[size]
        )} />
      </div>
      <p className="text-[#D2B48C] animate-pulse">Cargando...</p>
    </div>
  );
}
