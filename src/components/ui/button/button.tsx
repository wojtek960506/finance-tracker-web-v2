import clsx from "clsx";
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
        variantClassName = (
          "bg-bt-primary text-bt-primary-subtle border-bt-primary-border " +
          "hover:bg-bt-primary-hover"
        );
        break;
      default:
        
        variantClassName = "bg-bg text-fg border-fg hover:bg-fg/20";
    }

    return (
      <button
        {...props}
        ref={ref}
        className={clsx(
          className,
          "border px-2 py-2 rounded-xl cursor-pointer",
          variantClassName,
        )}
      >
        {children}
      </button>
    )
  }
)