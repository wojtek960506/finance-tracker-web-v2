import '@shared/i18n';

import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { PageLoading } from './page-loading';

describe('PageLoading', () => {
  it('renders default loading title and description', () => {
    render(<PageLoading testId="test-page-loading" />);

    expect(screen.getByTestId('test-page-loading')).toBeInTheDocument();
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('renders custom title and description when provided', () => {
    render(
      <PageLoading
        title="Custom Loading"
        description="Please wait for data"
        testId="custom-loading"
      />,
    );

    expect(screen.getByText('Custom Loading')).toBeInTheDocument();
    expect(screen.getByText('Please wait for data')).toBeInTheDocument();
  });
});
