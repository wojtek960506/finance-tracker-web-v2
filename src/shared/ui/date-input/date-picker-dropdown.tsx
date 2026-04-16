import clsx from "clsx";
import { ChevronDown } from "lucide-react";
import type { DropdownProps } from "react-day-picker";

export const DayPickerDropdown = ({
  className,
  disabled,
  options,
  value,
  classNames, // to avoid 'React does not recognize the `classNames` prop on a DOM element'
  ...props
}: DropdownProps) => {
  return (
    <span className={clsx('relative min-w-0', className)}>
      <select
        {...props}
        disabled={disabled}
        value={value}
        className="h-9 w-full appearance-none rounded-lg border border-fg bg-bg pl-3 pr-6 text-sm font-medium text-fg outline-none transition focus-visible:ring-2 focus-visible:ring-bt-secondary-ring"
      >
        {options?.map((option) => (
          <option key={option.value} value={option.value} disabled={option.disabled}>
            {option.label}
          </option>
        ))}
      </select>

      <ChevronDown
        className="pointer-events-none absolute top-1/2 right-2 size-3 -translate-y-1/2 text-text-muted "
        aria-hidden="true"
      />
    </span>
  );
};
