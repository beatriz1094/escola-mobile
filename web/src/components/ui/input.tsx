import * as React from "react"
import { cn } from "@/lib/utils"

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        ref={ref}
        className={cn(
          // Base cinza, bordas e fundo claros no modo claro
          "flex h-10 w-full rounded-md border border-gray-300 bg-gray-100 px-3 py-2 text-base text-gray-800 placeholder:text-gray-500",
          // Transições e foco em tons de cinza
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 focus-visible:ring-offset-2",
          // Modo escuro
          "dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 dark:placeholder:text-gray-400 dark:focus-visible:ring-gray-500 dark:focus-visible:ring-offset-gray-900",
          // Acessibilidade e responsividade
          "ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 md:text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-gray-700 dark:file:text-gray-300",
          className
        )}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }
