import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { NavigationProvider } from './navigation-provider';
import { useNavigation } from './use-navigation';

type TestProps = { label: string };

const TestComponent = ({ label }: TestProps) => {
  const { fromLeft } = useNavigation();
  return (
    <span>
      {label}-{fromLeft ? 'left' : 'right'}
    </span>
  );
};

describe('NavigationProvider', () => {
  it('provides navigation direction to children', () => {
    render(
      <NavigationProvider fromLeft={false}>
        <TestComponent label="nav" />
      </NavigationProvider>,
    );

    expect(screen.getByText('nav-right')).toBeInTheDocument();
  });
});
