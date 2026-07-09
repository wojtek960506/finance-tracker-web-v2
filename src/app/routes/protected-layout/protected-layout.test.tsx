import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { describe, expect, it } from 'vitest';

import { ProtectedLayout } from './protected-layout';

describe('ProtectedLayout', () => {
  it('renders outlet when authenticated', () => {
    const { container } = render(
      <MemoryRouter initialEntries={['/protected']}>
        <Routes>
          <Route element={<ProtectedLayout isAuthenticated />}>
            <Route path="/protected" element={<div>Protected</div>} />
          </Route>
        </Routes>
      </MemoryRouter>,
    );

    expect(screen.getByText('Protected')).toBeInTheDocument();
    expect(container.firstChild).toHaveClass(
      'flex',
      'h-full',
      'min-h-0',
      'flex-1',
      'flex-col',
      'p-4',
    );
  });

  it('redirects to login when not authenticated', () => {
    render(
      <MemoryRouter initialEntries={['/protected']}>
        <Routes>
          <Route element={<ProtectedLayout isAuthenticated={false} />}>
            <Route path="/protected" element={<div>Protected</div>} />
          </Route>
          <Route path="/login" element={<div>Login</div>} />
        </Routes>
      </MemoryRouter>,
    );

    expect(screen.getByText('Login')).toBeInTheDocument();
  });
});
