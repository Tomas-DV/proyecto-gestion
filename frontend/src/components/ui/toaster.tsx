"use client"

// Este archivo mantiene compatibilidad con el sistema de toast de Chakra UI
// En versiones estándar de Chakra UI, el toast se maneja automáticamente
// através del useToast hook

export const Toaster = () => {
  // En Chakra UI estándar, no necesitamos un componente Toaster separado
  // Los toasts se renderizan automáticamente cuando usas useToast()
  return null;
}
