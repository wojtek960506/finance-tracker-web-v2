import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { DropdownProps } from 'react-day-picker';
import { describe, expect, it, vi } from 'vitest';

import { DateInput } from './date-input';

const mocks = vi.hoisted(() => ({
  language: 'en' as const,
}));

vi.mock('@shared/hooks', () => ({
  useLanguage: () => ({ language: mocks.language }),
}));

vi.mock('@ui', () => ({
  Card: ({ children, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
    <div {...props}>{children}</div>
  ),
  getButtonClassName: ({ className }: { className?: string }) => className ?? '',
}));

vi.mock('react-day-picker', async () => {
  const actual =
    await vi.importActual<typeof import('react-day-picker')>('react-day-picker');
  type MockDayPickerProps = Pick<
    React.ComponentProps<typeof actual.DayPicker>,
    'month' | 'onMonthChange' | 'onSelect' | 'components'
  >;

  return {
    ...actual,
    DayPicker: (props: MockDayPickerProps) => {
      const Dropdown = props.components?.Dropdown as
        | React.ComponentType<DropdownProps>
        | undefined;

      return (
        <div>
          <span>{props.month?.toISOString().slice(0, 10)}</span>
          {Dropdown ? (
            <Dropdown
              className="dropdown"
              disabled={false}
              value="1"
              options={[{ value: '1', label: 'January', disabled: false }]}
              onChange={() => {}}
            />
          ) : null}
          <button
            type="button"
            onClick={() =>
              props.onSelect?.(new Date(2024, 1, 4), {}, {} as never, {} as never)
            }
          >
            pick day
          </button>
          <button
            type="button"
            onClick={() => props.onSelect?.(undefined, {}, {} as never, {} as never)}
          >
            clear day
          </button>
          <button
            type="button"
            onClick={() => props.onMonthChange?.(new Date(2026, 5, 1))}
          >
            change month
          </button>
        </div>
      );
    },
  };
});

vi.mock('react-day-picker/locale', () => ({
  de: {},
  enUS: {},
  pl: {},
  ru: {},
}));

describe('DateInput', () => {
  it('renders a formatted date, opens from the keyboard, and selects a day', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    const onBlur = vi.fn();
    const formattedDate = new Intl.DateTimeFormat('en-GB', {
      dateStyle: 'medium',
    }).format(new Date(2024, 0, 3));

    render(
      <DateInput
        value="2024-01-03"
        onChange={onChange}
        onBlur={onBlur}
        className="custom"
      />,
    );

    const trigger = screen.getByRole('button', { name: formattedDate });
    expect(trigger).toHaveClass('custom');

    fireEvent.keyDown(trigger, { key: 'Enter' });
    expect(screen.getByText(/^2024-01-/)).toBeInTheDocument();
    expect(screen.getByText('January')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'pick day' }));

    expect(onChange).toHaveBeenCalledWith('2024-02-04');
    expect(screen.queryByRole('button', { name: 'pick day' })).not.toBeInTheDocument();

    fireEvent.blur(trigger);
    expect(onBlur).toHaveBeenCalled();
  });

  it('closes on overlay and escape and falls back to raw invalid values', async () => {
    const user = userEvent.setup();
    const { container } = render(<DateInput value="bad-value" />);

    const trigger = screen.getByRole('button', { name: 'bad-value' });
    await user.click(trigger);
    expect(screen.getByRole('button', { name: 'pick day' })).toBeInTheDocument();

    const overlay = container.querySelector('button.fixed.inset-0');
    fireEvent.mouseDown(overlay as HTMLElement);
    expect(screen.queryByRole('button', { name: 'pick day' })).not.toBeInTheDocument();

    await user.click(trigger);
    await user.keyboard('{Escape}');
    expect(screen.queryByRole('button', { name: 'pick day' })).not.toBeInTheDocument();
  });

  it('does not open when disabled and supports space key opening otherwise', async () => {
    const user = userEvent.setup();
    const { rerender } = render(<DateInput value="2024-01-03" disabled />);

    const disabledTrigger = screen.getByRole('button', {
      name: new Intl.DateTimeFormat('en-GB', { dateStyle: 'medium' }).format(
        new Date(2024, 0, 3),
      ),
    });
    fireEvent.keyDown(disabledTrigger, { key: ' ' });
    await user.click(disabledTrigger);
    expect(screen.queryByRole('button', { name: 'pick day' })).not.toBeInTheDocument();

    rerender(<DateInput value="2024-01-03" />);
    fireEvent.keyDown(screen.getByRole('button'), { key: ' ' });
    expect(screen.getByRole('button', { name: 'pick day' })).toBeInTheDocument();
  });

  it('resets the visible month from the selected date on click and ignores non-toggle keys', async () => {
    const user = userEvent.setup();

    render(<DateInput value="2024-01-03" />);

    const trigger = screen.getByRole('button', {
      name: new Intl.DateTimeFormat('en-GB', { dateStyle: 'medium' }).format(
        new Date(2024, 0, 3),
      ),
    });

    await user.click(trigger);
    await user.click(screen.getByRole('button', { name: 'change month' }));
    expect(screen.getByText(/^2026-0[56]-/)).toBeInTheDocument();

    fireEvent.keyDown(document, { key: 'Tab' });
    expect(screen.getByRole('button', { name: 'pick day' })).toBeInTheDocument();

    await user.click(trigger);
    expect(screen.queryByRole('button', { name: 'pick day' })).not.toBeInTheDocument();

    await user.click(trigger);
    expect(screen.getByText(/^2024-01-/)).toBeInTheDocument();

    fireEvent.keyDown(trigger, { key: 'ArrowUp' });
    expect(screen.getByRole('button', { name: 'pick day' })).toBeInTheDocument();

    await user.click(trigger);
    await user.click(trigger);
    await user.click(screen.getByRole('button', { name: 'change month' }));
    fireEvent.keyDown(trigger, { key: 'Enter' });
    expect(screen.queryByRole('button', { name: 'pick day' })).not.toBeInTheDocument();
    fireEvent.keyDown(trigger, { key: 'Enter' });
    expect(screen.getByText(/^2024-01-/)).toBeInTheDocument();
  });

  it('supports empty values, invalid parsed dates, and clearing the selected date', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    const { rerender } = render(<DateInput onChange={onChange} />);

    const emptyTrigger = screen.getByRole('button');
    expect(emptyTrigger).toHaveTextContent('');
    expect(emptyTrigger).toHaveClass('text-text-muted');

    rerender(<DateInput value="Infinity-01-01" onChange={onChange} />);
    expect(screen.getByRole('button', { name: 'Infinity-01-01' })).toBeInTheDocument();

    rerender(<DateInput value="2024-01-03" onChange={onChange} />);
    await user.click(
      screen.getByRole('button', {
        name: new Intl.DateTimeFormat('en-GB', { dateStyle: 'medium' }).format(
          new Date(2024, 0, 3),
        ),
      }),
    );
    await user.click(screen.getByRole('button', { name: 'clear day' }));

    expect(onChange).toHaveBeenCalledWith('');
  });
});
