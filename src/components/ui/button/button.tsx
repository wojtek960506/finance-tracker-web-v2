import clsx from "clsx";
import { twMerge } from "tailwind-merge";
import { forwardRef, type ComponentProps } from "react";


type ButtonVariant = 
  | "default"
  | "inverse"
  | "primary"
  | "secondary"
  | "destructive"
  | "ghost";

type ButtonProps = ComponentProps<"button"> & {
  variant?: ButtonVariant;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant, className, children, ...props }, ref) => {

    variant = variant ?? "default";
    let variantClassName = "";

    switch(variant) {
      case "default":
        variantClassName = "bg-fg text-bg border-bg hover:bg-hover";
        break;
      case "primary":
        variantClassName = clsx(
          "bg-bt-primary text-bt-primary-subtle border-bt-primary-border",
          "hover:bg-bt-primary-hover"
        );
        break;
      case "ghost":
        variantClassName = clsx(
          "border-transparent bg-transparent hover:bg-bt-ghost-hover"
        )
        break;
      default:
        variantClassName = "bg-bg text-fg border-fg hover:bg-fg/20 ";
    }

    return (
      <button
        {...props}
        ref={ref}
        className={twMerge(clsx(
          "border px-2 py-2 rounded-xl cursor-pointer disabled:cursor-not-allowed",
          "flex items-center justify-center disabled:bg-bt-disabled",
          variantClassName,
          className,
        ))}
      >
        {children}
      </button>
    )
  }
)