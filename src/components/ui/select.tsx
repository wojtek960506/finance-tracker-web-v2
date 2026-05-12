import { CheckIcon, ChevronDownIcon, ChevronUpIcon, XIcon } from "lucide-react"
import { Select as SelectPrimitive } from "radix-ui"
import * as React from "react"

import { FORM_CONTROL_SIZE_CLASS, FORM_CONTROL_SURFACE_CLASS } from "@shared/consts"

import { cn } from "@/lib/utils"

function Select({
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Root>) {
  return <SelectPrimitive.Root data-slot="select" {...props} />
}

function SelectGroup({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Group>) {
  return (
    <SelectPrimitive.Group
      data-slot="select-group"
      className={cn("scroll-my-1 p-1", className)}
      {...props}
    />
  )
}

function SelectValue({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Value>) {
  return (
    <SelectPrimitive.Value
      data-slot="select-value"
      className={cn("block min-w-0 max-w-full flex-1 truncate", className)}
      {...props}
    />
  )
}

function SelectControl({
  className,
  children,
  clearable = false,
  hasValue = false,
  clearLabel = "Clear",
  onClear,
}: React.ComponentProps<"div"> & {
  clearable?: boolean
  hasValue?: boolean
  clearLabel?: string
  onClear?: () => void
}) {
  return (
    <div className={cn("relative w-full min-w-0 max-w-full", className)}>
      {children}
      <div className="pointer-events-none absolute top-1/2 right-2 z-[430] flex -translate-y-1/2 items-center gap-1">
        {clearable && hasValue ? (
          <button
            type="button"
            aria-label={clearLabel}
            className="pointer-events-auto flex size-6 items-center justify-center rounded-md text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
            onPointerDown={(event) => {
              event.preventDefault()
              event.stopPropagation()
              onClear?.()
            }}
          >
            <XIcon className="size-4" />
          </button>
        ) : null}

        <ChevronDownIcon className="size-4 text-muted-foreground" />
      </div>
    </div>
  )
}

function SelectTrigger({
  className,
  size = "default",
  showChevron = true,
  children,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Trigger> & {
  size?: "sm" | "default"
  showChevron?: boolean
}) {
  const isDefaultSize = size === "default"

  return (
    <SelectPrimitive.Trigger
      data-slot="select-trigger"
      data-size={size}
      className={cn(
        "relative flex w-full min-w-0 max-w-full cursor-pointer items-center gap-3 overflow-hidden text-left whitespace-nowrap outline-none select-none aria-invalid:border-destructive aria-invalid:ring-2 aria-invalid:ring-destructive-ring/50 data-[placeholder]:text-text-muted [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        isDefaultSize ? `${FORM_CONTROL_SIZE_CLASS} pr-8 sm:pr-9` : "h-8 rounded-lg px-3 text-sm",
        FORM_CONTROL_SURFACE_CLASS,
        className
      )}
      {...props}
    >
      {children}
      {showChevron ? (
        <SelectPrimitive.Icon asChild>
          <ChevronDownIcon className="pointer-events-none absolute top-1/2 right-2 size-4 -translate-y-1/2 text-text-muted" />
        </SelectPrimitive.Icon>
      ) : null}
    </SelectPrimitive.Trigger>
  )
}

function SelectContent({
  className,
  children,
  footer,
  position = "item-aligned",
  align = "center",
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Content> & {
  footer?: React.ReactNode
}) {
  return (
    <SelectPrimitive.Portal>
      <SelectPrimitive.Content
        data-slot="select-content"
        data-align-trigger={position === "item-aligned"}
        className={cn("relative z-[440] max-h-(--radix-select-content-available-height) min-w-36 origin-(--radix-select-content-transform-origin) overflow-x-hidden overflow-y-auto rounded-2xl border border-fg bg-modal-bg text-fg shadow-md data-[align-trigger=true]:animate-none", position ==="popper"&&"data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1", className )}
        position={position}
        align={align}
        {...props}
      >
        <SelectScrollUpButton />
        <SelectPrimitive.Viewport
          data-position={position}
          className={cn(
            "p-2 data-[position=popper]:h-(--radix-select-trigger-height) data-[position=popper]:w-full data-[position=popper]:min-w-(--radix-select-trigger-width)",
            position === "popper" && ""
          )}
        >
          {children}
        </SelectPrimitive.Viewport>
        {footer ? <div className="border-t border-fg/20 p-2">{footer}</div> : null}
        <SelectScrollDownButton />
      </SelectPrimitive.Content>
    </SelectPrimitive.Portal>
  )
}

function SelectLabel({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Label>) {
  return (
    <SelectPrimitive.Label
      data-slot="select-label"
      className={cn("px-1 py-1 text-xs font-semibold uppercase tracking-wide text-text-muted", className)}
      {...props}
    />
  )
}

function SelectItem({
  className,
  children,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Item>) {
  return (
    <SelectPrimitive.Item
      data-slot="select-item"
      className={cn(
        "relative flex w-full cursor-default items-center gap-2 rounded-lg py-2 pr-8 pl-2 text-base text-fg outline-hidden select-none focus:bg-bg focus:text-fg data-disabled:pointer-events-none data-disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 *:[span]:last:flex *:[span]:last:items-center *:[span]:last:gap-2",
        className
      )}
      {...props}
    >
      <span className="pointer-events-none absolute right-2 flex size-4 items-center justify-center">
        <SelectPrimitive.ItemIndicator>
          <CheckIcon className="pointer-events-none" />
        </SelectPrimitive.ItemIndicator>
      </span>
      <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
    </SelectPrimitive.Item>
  )
}

function SelectSeparator({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Separator>) {
  return (
    <SelectPrimitive.Separator
      data-slot="select-separator"
      className={cn("pointer-events-none -mx-1 my-1 h-px bg-fg/20", className)}
      {...props}
    />
  )
}

function SelectScrollUpButton({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.ScrollUpButton>) {
  return (
    <SelectPrimitive.ScrollUpButton
      data-slot="select-scroll-up-button"
      className={cn(
        "z-10 flex cursor-default items-center justify-center bg-modal-bg py-1 text-text-muted [&_svg:not([class*='size-'])]:size-4",
        className
      )}
      {...props}
    >
      <ChevronUpIcon
      />
    </SelectPrimitive.ScrollUpButton>
  )
}

function SelectScrollDownButton({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.ScrollDownButton>) {
  return (
    <SelectPrimitive.ScrollDownButton
      data-slot="select-scroll-down-button"
      className={cn(
        "z-10 flex cursor-default items-center justify-center bg-modal-bg py-1 text-text-muted [&_svg:not([class*='size-'])]:size-4",
        className
      )}
      {...props}
    >
      <ChevronDownIcon
      />
    </SelectPrimitive.ScrollDownButton>
  )
}

export {
  Select,
  SelectContent,
  SelectControl,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectScrollDownButton,
  SelectScrollUpButton,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
}
