import { screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { renderWithProviders } from '@test-utils';

import App from './App';

describe('App', () => {
  it('renders the Finance Tracker title', () => {
    renderWithProviders(<App />);

    expect(screen.getByText(/finance tracker/i)).toBeInTheDocument();
  });
});
