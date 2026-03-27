import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';

import { Title } from './title';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => `label-${key}`,
  }),
}));

describe('Title', () => {
  it('renders the translated title and links to root', () => {
    render(
      <MemoryRouter>
        <Title />
      </MemoryRouter>,
    );

    const link = screen.getByRole('link', { name: 'label-title' });
    expect(link).toHaveAttribute('href', '/');
  });
});
