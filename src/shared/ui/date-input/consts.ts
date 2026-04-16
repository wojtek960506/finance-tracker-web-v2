import type { ClassNames } from 'react-day-picker';
import { de, enUS, pl, ru } from 'react-day-picker/locale';

import { getButtonClassName } from '../button';

import type { Language } from '@/shared/types';

export const START_MONTH = new Date(2000, 0);
export const END_MONTH = new Date(new Date().getFullYear() + 5, 11);

export const LANGUAGE_TO_LOCALE: Record<Language, string> = {
  en: 'en-GB',
  pl: 'pl-PL',
  de: 'de-DE',
  ru: 'ru-RU',
};

export const LANGUAGE_TO_DAY_PICKER_LOCALE: Record<Language, typeof enUS> = {
  en: enUS,
  pl,
  de,
  ru,
};

export const DAY_PICKER_CLASS_NAMES = {
  root: 'bt-date-picker select-none',
  months: 'flex',
  month: 'grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-x-2 gap-y-3',
  month_caption: 'min-w-0',
  dropdowns: 'grid grid-cols-2 gap-2',
  dropdown_root: 'min-w-0',
  dropdown: 'min-w-0',
  caption_label: 'hidden',
  months_dropdown: 'min-w-0',
  years_dropdown: 'min-w-0',
  button_previous: getButtonClassName({
    variant: 'ghost',
    className:
      'size-9 sm:size-10 rounded-lg border border-fg bg-bg p-0 text-text-muted hover:bg-bt-ghost-hover hover:text-fg',
  }),
  button_next: getButtonClassName({
    variant: 'ghost',
    className:
      'size-9 sm:size-10 rounded-lg border border-fg bg-bg p-0 text-text-muted hover:bg-bt-ghost-hover hover:text-fg',
  }),
  chevron: 'size-4 fill-current text-text-muted',
  month_grid: 'col-span-3 w-full border-collapse',
  weekdays: 'border-b border-fg/10',
  weekday:
    'h-9 w-9 sm:h-10 sm:w-10 px-0 text-center align-middle text-[11px] sm:text-xs font-semibold uppercase tracking-[0.18em] text-text-muted',
  week: 'mt-1',
  day: 'h-9 w-9 sm:h-10 sm:w-10 p-0 text-center justify-center',
  day_button:
    'mx-auto flex size-9 sm:size-10 items-center justify-center rounded-xl border border-transparent text-sm sm:text-base font-medium text-fg transition hover:bg-bt-secondary-subtle hover:text-fg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-bt-secondary-ring',
  selected:
    '[&_button]:border-bt-primary-border [&_button]:bg-bt-primary [&_button]:text-bt-primary-subtle [&_button]:hover:bg-bt-primary-hover',
  today: '[&_button]:border-fg/35 [&_button]:font-semibold',
  outside: 'text-text-muted/55',
  disabled: 'opacity-40',
} satisfies Partial<ClassNames>;
