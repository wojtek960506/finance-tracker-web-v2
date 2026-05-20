import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { CreateTransaction } from './create-transaction';

const navigate = vi.fn();
const location = { state: undefined };

vi.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

vi.mock('react-router-dom', () => ({
  useNavigate: () => navigate,
  useLocation: () => location,
}));

describe('CreateTransaction', () => {
  it('renders transaction kind cards and navigates to selected routes', async () => {
    const user = userEvent.setup();

    render(<CreateTransaction />);

    expect(screen.getByText('chooseTransactionKind')).toBeInTheDocument();
    expect(screen.getByText('chooseTransactionKindDescription')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /standardTransaction/i }));
    await user.click(screen.getByRole('button', { name: /transferTransaction/i }));
    await user.click(screen.getByRole('button', { name: /exchangeTransaction/i }));
    await user.click(screen.getByRole('button', { name: /bulkTransaction/i }));

    expect(navigate).toHaveBeenNthCalledWith(1, '/transactions/new/standard', {
      state: { returnTo: '/transactions' },
    });
    expect(navigate).toHaveBeenNthCalledWith(2, '/transactions/new/transfer', {
      state: { returnTo: '/transactions' },
    });
    expect(navigate).toHaveBeenNthCalledWith(3, '/transactions/new/exchange', {
      state: { returnTo: '/transactions' },
    });
    expect(navigate).toHaveBeenNthCalledWith(4, '/transactions/new/bulk', {
      state: { returnTo: '/transactions' },
    });
  });
});
