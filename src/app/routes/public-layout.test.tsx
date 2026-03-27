import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { describe, expect, it } from 'vitest';

import { PublicLayout } from './public-layout';

describe('PublicLayout', () => {
  it('renders outlet when not authenticated', () => {
    render(
      <MemoryRouter initialEntries={['/public']}>
        <Routes>
          <Route element={<PublicLayout isAuthenticated={false} />}>
            <Route path="/public" element={<div>Public</div>} />
          </Route>
        </Routes>
      </MemoryRouter>,
    );

    expect(screen.getByText('Public')).toBeInTheDocument();
  });

  it('redirects to transactions when authenticated', () => {
    render(
      <MemoryRouter initialEntries={['/public']}>
        <Routes>
          <Route element={<PublicLayout isAuthenticated />}>
            <Route path="/public" element={<div>Public</div>} />
          </Route>
          <Route path="/transactions" element={<div>Transactions</div>} />
        </Routes>
      </MemoryRouter>,
    );

    expect(screen.getByText('Transactions')).toBeInTheDocument();
  });
});
