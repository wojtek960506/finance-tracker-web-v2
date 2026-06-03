import clsx from "clsx";
import { LoaderCircle } from "lucide-react";

import { FORM_BUTTON_SIZE_CLASS } from "@/shared/consts";
import { Button, ButtonLink } from "@/shared/ui";

type AuthFormButtonsProps = {
  isPrimaryPending: boolean;
  isPrimaryDisabled: boolean;
  primaryText: string;
  primaryTextPending: string;
  isSecondaryDisabled: boolean;
  secondaryText: string;
  secondaryTo: string;
}

export const AuthFormButtons = ({
  isPrimaryPending,
  isPrimaryDisabled,
  primaryText,
  primaryTextPending,
  isSecondaryDisabled,
  secondaryText,
  secondaryTo,
}: AuthFormButtonsProps) => {
  return (
    <div className="mt-6 flex flex-col gap-2">
      <Button
        disabled={isPrimaryDisabled}
        type="submit"
        className={clsx(FORM_BUTTON_SIZE_CLASS, 'gap-2 font-semibold sm:font-bold')}
      >
        {isPrimaryPending ? (
          <>
            <LoaderCircle className="size-4 animate-spin sm:size-5" aria-hidden="true" />
            {primaryTextPending}
          </>
        ) : (
          primaryText
        )}
      </Button>
      <ButtonLink
        to={secondaryTo}
        variant="outline"
        preventFocusOnPress
        disabled={isSecondaryDisabled}
        className={clsx(FORM_BUTTON_SIZE_CLASS, 'font-semibold sm:font-bold')}
      >
        {secondaryText}
      </ButtonLink>
    </div>
  )
}
