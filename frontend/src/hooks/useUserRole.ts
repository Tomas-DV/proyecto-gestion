'use client';

import { useState, useEffect, useCallback } from 'react';
import { authStorage } from '@/utils/auth';

export type UserRole = 'USER' | 'ADMIN' | null;

export interface UseUserRoleReturn {
  role: UserRole;
  isAdmin: boolean;
  isUser: boolean;
  isAuthenticated: boolean;
  refreshRole: () => void;
}

export const useUserRole = (): UseUserRoleReturn => {
  const [role, setRole] = useState<UserRole>(null);

  const refreshRole = useCallback(() => {
    const user = authStorage.getUser();
    if (user && user.role) {
      setRole(user.role as UserRole);
    } else {
      setRole(null);
    }
  }, []);

  useEffect(() => {
    refreshRole();
    
    // Escuchar cambios en el localStorage
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'authUser' || e.key === 'authToken') {
        refreshRole();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [refreshRole]);

  return {
    role,
    isAdmin: role === 'ADMIN',
    isUser: role === 'USER',
    isAuthenticated: role !== null,
    refreshRole
  };
};
