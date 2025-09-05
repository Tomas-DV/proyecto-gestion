"use client"

import { ChakraProvider } from "@chakra-ui/react"
import theme from "@/theme"
import {
  ColorModeProvider,
  type ColorModeProviderProps,
} from "./color-mode"

export function Provider(props: ColorModeProviderProps) {
  return (
    <ChakraProvider theme={theme}>
      <ColorModeProvider {...props} />
    </ChakraProvider>
  )
}
