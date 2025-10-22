import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-gray-500 focus-visible:ring-gray-400/50 focus-visible:ring-[3px] aria-invalid:ring-red-300 dark:aria-invalid:ring-red-400 aria-invalid:border-red-400",
  {
    variants: {
      variant: {
        // Botão principal (cinza médio)
        default:
          "bg-gray-600 text-white hover:bg-gray-700 active:bg-gray-800 dark:bg-gray-500 dark:hover:bg-gray-400 dark:text-gray-50",
        
        // Botão destrutivo (vermelho claro)
        destructive:
          "bg-red-500 text-white hover:bg-red-600 focus-visible:ring-red-400/50 dark:bg-red-600 dark:hover:bg-red-500",
        
        // Borda cinza
        outline:
          "border border-gray-300 bg-white text-gray-800 hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 dark:hover:bg-gray-700",
        
        // Secundário (cinza claro)
        secondary:
          "bg-gray-200 text-gray-800 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-100 dark:hover:bg-gray-600",
        
        // Ghost (sem borda, fundo ao passar o mouse)
        ghost:
          "text-gray-700 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-200 dark:hover:bg-gray-800",
        
        // Link (cinza escuro com sublinhado)
        link: "text-gray-700 underline-offset-4 hover:underline dark:text-gray-300",
      },
      size: {
        default: "h-9 px-4 py-2 has-[>svg]:px-3",
        sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
        lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
        icon: "size-9",
        "icon-sm": "size-8",
        "icon-lg": "size-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot : "button"

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
