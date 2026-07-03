import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { BrandLink } from './brand-link';

const mocks = vi.hoisted(() => ({
  theme: { value: 'light' as 'light' | 'dark' },
}));

vi.mock('@context/theme-context', () => ({
  useTheme: () => ({ theme: mocks.theme.value }),
}));

describe('BrandLink', () => {
  it('renders the light logo in light theme', () => {
    mocks.theme.value = 'light';

    render(<BrandLink />);

    const link = screen.getByRole('link', { name: 'Open Devonion home page' });
    const image = screen.getByAltText('Devonion');

    expect(link).toHaveAttribute('href', 'https://devonion.com');
    expect(link).toHaveAttribute('target', '_blank');
    expect(image).toHaveAttribute('src', '/brand/DEVONION-LOGO-LIGHT.svg');
  });

  it('renders the dark logo in dark theme', () => {
    mocks.theme.value = 'dark';

    render(<BrandLink />);

    expect(screen.getByAltText('Devonion')).toHaveAttribute(
      'src',
      '/brand/DEVONION-LOGO-DARK.svg',
    );
  });
});
