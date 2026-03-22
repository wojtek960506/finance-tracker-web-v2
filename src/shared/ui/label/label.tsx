import clsx from "clsx";
import { forwardRef, type ComponentProps } from "react";


export const Label = forwardRef<HTMLLabelElement, ComponentProps<"label">>(
  ({children, className, ...props}, ref) => (
    <label ref={ref} {...props} className={clsx("flex flex-col gap-2", className)}>
      {children}
    </label>
  )
);
