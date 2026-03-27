import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { Input } from './input';

describe('Input', () => {
  it('renders an input with provided props', () => {
    render(<Input placeholder="Email" className="custom-class" />);

    const input = screen.getByPlaceholderText('Email');
    expect(input).toBeInTheDocument();
    expect(input).toHaveClass('custom-class');
  });
});
