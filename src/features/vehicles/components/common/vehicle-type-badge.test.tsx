import '@shared/i18n';

import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { VehicleTypeBadge } from './vehicle-type-badge';

describe('VehicleTypeBadge', () => {
  it('renders car badge with correct label and icon', () => {
    render(<VehicleTypeBadge type="car" />);

    expect(screen.getByText('Car')).toBeInTheDocument();
  });

  it('renders motorcycle badge', () => {
    render(<VehicleTypeBadge type="motorcycle" />);

    expect(screen.getByText('Motorcycle')).toBeInTheDocument();
  });

  it('renders public transport badge', () => {
    render(<VehicleTypeBadge type="public_transport" />);

    expect(screen.getByText('Public Transport')).toBeInTheDocument();
  });
});
