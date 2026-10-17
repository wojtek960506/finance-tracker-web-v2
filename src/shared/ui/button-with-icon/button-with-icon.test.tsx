import { fireEvent, render, screen } from '@testing-library/react';
import { ArrowRight, Plus } from 'lucide-react';
import { describe, expect, it, vi } from 'vitest';

import { ButtonWithIcon } from './button-with-icon';

describe('ButtonWithIcon', () => {
  it('renders label and icon correctly on left by default', () => {
    render(<ButtonWithIcon icon={Plus} label="Add item" />);

    const button = screen.getByRole('button', { name: /add item/i });
    expect(button).toBeInTheDocument();
  });

  it('renders icon on right when iconPosition is right', () => {
    render(<ButtonWithIcon icon={ArrowRight} iconPosition="right" label="Next" />);

    const button = screen.getByRole('button', { name: /next/i });
    expect(button).toBeInTheDocument();
    const children = Array.from(button.childNodes);
    // Span (label) should come before SVG (icon)
    expect(children[0].nodeName).toBe('SPAN');
    expect(children[1].nodeName).toBe('svg');
  });

  it('handles click events', () => {
    const handleClick = vi.fn();
    render(<ButtonWithIcon icon={Plus} label="Click me" onClick={handleClick} />);

    fireEvent.click(screen.getByRole('button', { name: /click me/i }));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('renders children when passed', () => {
    render(
      <ButtonWithIcon icon={Plus}>
        <span data-testid="custom-child">Custom Content</span>
      </ButtonWithIcon>,
    );

    expect(screen.getByTestId('custom-child')).toBeInTheDocument();
  });

  it('is disabled when disabled prop is true', () => {
    const handleClick = vi.fn();
    render(
      <ButtonWithIcon icon={Plus} label="Disabled" disabled onClick={handleClick} />,
    );

    const button = screen.getByRole('button', { name: /disabled/i });
    expect(button).toBeDisabled();
    fireEvent.click(button);
    expect(handleClick).not.toHaveBeenCalled();
  });
});
