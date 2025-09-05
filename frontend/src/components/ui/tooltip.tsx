import { Tooltip as ChakraTooltip, TooltipProps as ChakraTooltipProps } from "@chakra-ui/react"
import * as React from "react"

export interface TooltipProps extends Omit<ChakraTooltipProps, 'children'> {
  content: React.ReactNode
  children: React.ReactElement
  disabled?: boolean
}

export const Tooltip = React.forwardRef<HTMLDivElement, TooltipProps>(
  function Tooltip(props, ref) {
    const {
      children,
      disabled,
      content,
      ...rest
    } = props

    if (disabled) return children

    return (
      <ChakraTooltip label={content} {...rest}>
        {children}
      </ChakraTooltip>
    )
  },
)
