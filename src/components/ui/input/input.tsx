import clsx from "clsx";
import { forwardRef, type ComponentProps } from "react";


type InputProps = ComponentProps<"input">;

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, children, ...props}, ref) => (
    <input
      {...props}
      ref={ref}
      className={clsx(
        "border border-fg text-fg px-2 py-1 rounded-lg",
        className,
      )}
    >
      {children}
    </input>
  )
)