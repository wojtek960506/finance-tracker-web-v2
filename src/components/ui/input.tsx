import * as React from "react"

import { FORM_CONTROL_SIZE_CLASS, FORM_CONTROL_SURFACE_CLASS } from "@shared/consts"
import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "w-full min-w-0 outline-none file:inline-flex file:h-6 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-text-muted disabled:pointer-events-none disabled:bg-input/50 aria-invalid:border-destructive aria-invalid:ring-2 aria-invalid:ring-destructive/20",
        FORM_CONTROL_SIZE_CLASS,
        FORM_CONTROL_SURFACE_CLASS,
        className
      )}
      {...props}
    />
  )
}

export { Input }
