import { XIcon } from "lucide-react"
import * as React from "react"

import { Button } from "@/components/ui/button"
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxGroup,
  ComboboxItem,
  ComboboxList,
  ComboboxSeparator,
  ComboboxTrigger,
} from "@/components/ui/combobox"
import { cn } from "@/lib/utils"

export type MultiSelectOption = {
  value: string
  label: string
  disabled?: boolean
  icon?: React.ReactNode
}

export type MultiSelectGroup = {
  key: string
  label?: string
  options: MultiSelectOption[]
}

type MultiSelectProps = {
  values: string[]
  groups: MultiSelectGroup[]
  onChange: (values: string[]) => void
  placeholder: string
  emptyMessage: string
  disabled?: boolean
  footer?: React.ReactNode
}

export function MultiSelect({
  values,
  groups,
  onChange,
  placeholder,
  emptyMessage,
  disabled = false,
  footer,
}: MultiSelectProps) {
  const allOptions = React.useMemo(
    () => groups.flatMap((group) => group.options),
    [groups]
  )

  const selectedOptions = React.useMemo(
    () => allOptions.filter((option) => values.includes(option.value)),
    [allOptions, values]
  )

  const handleValueChange = React.useCallback(
    (nextOptions: MultiSelectOption[]) => {
      onChange(nextOptions.map((option) => option.value))
    },
    [onChange]
  )

  const summaryText =
    selectedOptions.length > 0
      ? selectedOptions.map((option) => option.label).join(", ")
      : placeholder

  return (
    <Combobox<MultiSelectOption, true>
      items={allOptions}
      multiple
      value={selectedOptions}
      disabled={disabled}
      itemToStringLabel={(option) => option.label}
      itemToStringValue={(option) => option.value}
      onValueChange={handleValueChange}
    >
      <div className="relative w-full min-w-0 max-w-full">
        <ComboboxTrigger
          className={cn(
            "flex h-10 w-full min-w-0 max-w-full items-center justify-between gap-3 overflow-hidden whitespace-nowrap rounded-xl border border-fg bg-bg px-3 text-left text-base text-fg transition-colors hover:bg-fg/5 focus-visible:border-fg focus-visible:ring-2 focus-visible:ring-blue-300 disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:bg-bg",
            selectedOptions.length === 0 && "text-text-muted"
          )}
        >
          <span className="block min-w-0 flex-1 truncate">{summaryText}</span>
        </ComboboxTrigger>

        {selectedOptions.length > 0 ? (
          <div className="mt-2 flex min-w-0 max-w-full flex-wrap gap-2">
            {selectedOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                className="inline-flex min-w-0 max-w-full items-center gap-1 rounded-full border border-fg/20 bg-bg px-2 py-1 text-xs font-medium text-fg transition hover:border-fg/40"
                onClick={() =>
                  onChange(values.filter((value) => value !== option.value))
                }
              >
                <span className="truncate">{option.label}</span>
                <XIcon className="size-3" aria-hidden="true" />
              </button>
            ))}
          </div>
        ) : null}
      </div>

      <ComboboxContent>
        <ComboboxEmpty>{emptyMessage}</ComboboxEmpty>
        <ComboboxList>
          {groups
            .filter((group) => group.options.length > 0)
            .map((group, index) => (
            <React.Fragment key={group.key}>
              {index > 0 ? <ComboboxSeparator /> : null}
              <ComboboxGroup>
                {group.options.map((option) => (
                  <ComboboxItem
                    key={option.value}
                    value={option}
                    disabled={option.disabled}
                  >
                    <span className="flex min-w-0 items-center gap-2">
                      {option.icon ? (
                        <span className="shrink-0 text-text-muted">
                          {option.icon}
                        </span>
                      ) : null}
                      <span className="truncate">{option.label}</span>
                    </span>
                  </ComboboxItem>
                ))}
              </ComboboxGroup>
            </React.Fragment>
          ))}
        </ComboboxList>
        {footer ? <div className="border-t border-fg/20 p-2">{footer}</div> : null}
      </ComboboxContent>
    </Combobox>
  )
}
