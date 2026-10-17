import '@shared/i18n';

import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { VehiclePageError } from './vehicle-page-error';
import { VehiclePageLoading } from './vehicle-page-loading';

describe('VehiclePageLoading', () => {
  it('renders default loading state with fallback text', () => {
    render(<VehiclePageLoading />);
    expect(screen.getByText(/loading vehicle/i)).toBeInTheDocument();
  });

  it('renders custom title and description when provided', () => {
    render(
      <VehiclePageLoading
        title="Loading fleet..."
        description="Fetching your vehicles"
      />,
    );
    expect(screen.getByText('Loading fleet...')).toBeInTheDocument();
    expect(screen.getByText('Fetching your vehicles')).toBeInTheDocument();
  });
});

describe('VehiclePageError', () => {
  it('renders error message and triggers retry on button click', () => {
    const onRetry = vi.fn();
    render(
      <VehiclePageError
        error={new Error('Network timeout')}
        onRetry={onRetry}
        testId="vehicles-test-error"
      />,
    );

    expect(screen.getByTestId('vehicles-test-error')).toBeInTheDocument();
    expect(screen.getByText('Network timeout')).toBeInTheDocument();

    const retryBtn = screen.getByRole('button', { name: /retry/i });
    fireEvent.click(retryBtn);
    expect(onRetry).toHaveBeenCalledTimes(1);
  });

  it('renders fallback message when error is null', () => {
    render(
      <VehiclePageError
        error={null}
        fallbackMessage="Custom fallback error"
        onRetry={vi.fn()}
        testId="vehicles-fallback-error"
      />,
    );

    expect(screen.getByText('Custom fallback error')).toBeInTheDocument();
  });
});
