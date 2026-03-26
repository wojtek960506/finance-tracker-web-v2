import type { ReactNode } from 'react';

export const Detail = ({ title, children }: { title: string; children: ReactNode }) => {
  return (
    <div className="flex flex-col gap-0">
      <span className="text-text-muted text-left text-sm">{title}</span>
      <span className="text-base sm:text-lg">{children}</span>
    </div>
  );
};
