import clsx from 'clsx';
import { type ComponentProps, type ReactNode, useEffect, useRef, useState } from 'react';

import { Button } from '@ui';

export type DropdownItem = {
  label: string;
  icon?: ReactNode;
  onSelect: () => void;
  className?: string;
  variant?: ComponentProps<typeof Button>['variant'];
};

export type DropdownProps = {
  trigger: ReactNode;
  items: DropdownItem[];
  align?: 'left' | 'right';
};

export const Dropdown = ({ trigger, items, align = 'right' }: DropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close on click outside
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  return (
    <div ref={dropdownRef} className="relative">
      <div
        onClick={() => {
          setIsOpen((prev) => !prev);
        }}
      >
        {trigger}
      </div>

      {isOpen && (
        <div
          className={clsx(
            'absolute top-full mt-1 bg-modal-bg text-fg shadow-lg',
            align === 'left' ? 'left-0' : 'right-0',
            'rounded-md z-150  p-2',
          )}
        >
          {items.map((item, idx) => (
            <Button
              key={idx}
              variant={item.variant ?? 'ghost'}
              className={clsx('w-full justify-start gap-2', item.className)}
              onClick={() => {
                item.onSelect();
                setIsOpen(false);
              }}
            >
              {item.icon}
              {item.label}
            </Button>
          ))}
        </div>
      )}
    </div>
  );
};
