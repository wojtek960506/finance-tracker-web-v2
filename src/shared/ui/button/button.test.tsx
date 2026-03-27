import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { Button } from './button';

describe('Button', () => {
  it('renders default variant when none provided', () => {
    render(<Button>Default</Button>);

    const button = screen.getByRole('button', { name: 'Default' });
    expect(button).toHaveClass('bg-fg');
    expect(button).toHaveClass('text-bg');
  });

  it('renders primary variant styles', () => {
    render(<Button variant="primary">Primary</Button>);

    expect(screen.getByRole('button', { name: 'Primary' })).toHaveClass('bg-bt-primary');
  });

  it('renders secondary variant styles', () => {
    render(<Button variant="secondary">Secondary</Button>);

    expect(screen.getByRole('button', { name: 'Secondary' })).toHaveClass(
      'bg-bt-secondary',
    );
  });

  it('renders ghost variant styles', () => {
    render(<Button variant="ghost">Ghost</Button>);

    expect(screen.getByRole('button', { name: 'Ghost' })).toHaveClass('bg-transparent');
  });

  it('renders destructive variant styles', () => {
    render(<Button variant="destructive">Destructive</Button>);

    expect(screen.getByRole('button', { name: 'Destructive' })).toHaveClass(
      'bg-destructive',
    );
  });

  it('renders inverse variant styles', () => {
    render(<Button variant="inverse">Inverse</Button>);

    expect(screen.getByRole('button', { name: 'Inverse' })).toHaveClass('bg-bg');
    expect(screen.getByRole('button', { name: 'Inverse' })).toHaveClass('text-fg');
  });

  it('renders outline variant styles', () => {
    render(<Button variant="outline">Outline</Button>);

    expect(screen.getByRole('button', { name: 'Outline' })).toHaveClass('border-fg');
  });

  it('merges custom className', () => {
    render(<Button className="custom-class">Custom</Button>);

    expect(screen.getByRole('button', { name: 'Custom' })).toHaveClass('custom-class');
  });
});
