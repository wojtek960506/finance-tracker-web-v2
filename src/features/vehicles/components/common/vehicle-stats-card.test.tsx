import { render, screen } from '@testing-library/react';
import { Fuel } from 'lucide-react';
import { describe, expect, it } from 'vitest';

import { VehicleStatsCard } from './vehicle-stats-card';

describe('VehicleStatsCard', () => {
  it('renders title, value, and subtext', () => {
    render(
      <VehicleStatsCard
        title="Total Volume"
        value="500 L"
        subtext="All time"
        Icon={Fuel}
        data-testid="stats-card"
      />,
    );

    expect(screen.getByTestId('stats-card')).toBeInTheDocument();
    expect(screen.getByText('Total Volume')).toBeInTheDocument();
    expect(screen.getByText('500 L')).toBeInTheDocument();
    expect(screen.getByText('All time')).toBeInTheDocument();
  });

  it('applies iconClassName directly to the Icon element', () => {
    const { container } = render(
      <VehicleStatsCard
        title="Fuel"
        value="100 L"
        Icon={Fuel}
        iconClassName="text-amber-500"
      />,
    );

    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
    expect(svg).toHaveClass('text-amber-500');
  });

  it('falls back to text-fg when iconClassName is not provided', () => {
    const { container } = render(
      <VehicleStatsCard title="Fuel" value="100 L" Icon={Fuel} />,
    );

    const iconWrapper = container.querySelector('.size-7');
    expect(iconWrapper).toHaveClass('text-fg');
  });
});
