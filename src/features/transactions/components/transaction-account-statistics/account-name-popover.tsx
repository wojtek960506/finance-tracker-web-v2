import clsx from 'clsx';
import { useEffect, useId, useRef, useState } from 'react';

type AccountNamePopoverProps = {
  label: string;
};

export const AccountNamePopover = ({ label }: AccountNamePopoverProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const popoverRef = useRef<HTMLDivElement | null>(null);
  const popoverId = useId();

  useEffect(() => {
    if (!isOpen) return;

    const handlePointerDown = (event: MouseEvent | TouchEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('touchstart', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('touchstart', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  return (
    <div ref={popoverRef} className="relative min-w-0">
      <button
        type="button"
        className={clsx(
          'flex w-full min-w-0 items-center rounded-md text-left',
          'cursor-pointer hover:bg-bg/40',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fg/40',
        )}
        onClick={() => setIsOpen((current) => !current)}
        aria-expanded={isOpen}
        aria-controls={popoverId}
        title={label}
      >
        <span className="block min-w-0 truncate text-lg font-semibold sm:text-xl">
          {label}
        </span>
      </button>

      {isOpen ? (
        <div
          id={popoverId}
          role="tooltip"
          className={clsx(
            'absolute left-0 top-full z-20 mt-2 max-w-[20rem] rounded-2xl',
            'border border-fg/15 bg-modal-bg px-3 py-2 shadow-lg',
          )}
        >
          <p className="break-words text-sm font-medium text-text sm:text-base">
            {label}
          </p>
        </div>
      ) : null}
    </div>
  );
};
