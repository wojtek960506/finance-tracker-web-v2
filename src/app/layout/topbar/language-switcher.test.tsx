import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { SUPPORTED_LANGUAGES } from '@shared/consts';

import { LanguageSwitcher } from './language-switcher';

const mocks = vi.hoisted(() => ({
  language: { value: 'en' as keyof typeof SUPPORTED_LANGUAGES },
  setLanguage: vi.fn(),
}));

vi.mock('@shared/hooks', () => ({
  useLanguage: () => ({
    language: mocks.language.value,
    setLanguage: mocks.setLanguage,
  }),
}));

vi.mock('react-flagkit', () => ({
  default: () => <span data-testid="flag" />,
}));

vi.mock('@ui', () => ({
  Button: ({ children, ...props }: any) => <button {...props}>{children}</button>,
  Dropdown: ({ trigger, items }: any) => (
    <div>
      <div data-testid="trigger">{trigger}</div>
      {items.map((item: any) => (
        <button key={item.label} type="button" onClick={item.onSelect}>
          {item.label}
        </button>
      ))}
    </div>
  ),
}));

describe('LanguageSwitcher', () => {
  it('renders the current language flag', () => {
    render(<LanguageSwitcher />);

    expect(screen.getByTestId('flag')).toBeInTheDocument();
  });

  it('calls setLanguage when a language is selected', async () => {
    const user = userEvent.setup();
    render(<LanguageSwitcher />);

    const label = SUPPORTED_LANGUAGES.pl.label;
    await user.click(screen.getByRole('button', { name: label }));

    expect(mocks.setLanguage).toHaveBeenCalledWith('pl');
  });
});
