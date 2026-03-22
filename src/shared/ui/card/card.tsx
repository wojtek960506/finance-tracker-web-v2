import clsx from "clsx";
import type { ReactNode } from "react";


type CardProps = {
  className?: string;
  children: ReactNode;
}

export const Card = ({
  className = "",
  children,
}: CardProps) => {
  return (
    <div className={clsx("flex flex-col border border-fg rounded-3xl p-4" , className)}>
      {children}
    </div>
  )
}
