import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';

import { Collapsible } from './collapsible';

describe('Collapsible', () => {
  it('toggles open state when indicator is on the left', async () => {
    const user = userEvent.setup();

    render(
      <Collapsible header={<span>Header</span>} indicatorPosition="left">
        <div>Content</div>
      </Collapsible>,
    );

    const toggle = screen.getByRole('button', { name: 'Expand menu' });
    expect(toggle).toHaveAttribute('aria-expanded', 'false');

    await user.click(toggle);

    expect(screen.getByRole('button', { name: 'Collapse menu' })).toHaveAttribute(
      'aria-expanded',
      'true',
    );
  });

  it('respects initial open state and right indicator', () => {
    render(
      <Collapsible header={<span>Header</span>} indicatorPosition="right" isInitiallyOpen>
        <div>Content</div>
      </Collapsible>,
    );

    const toggle = screen.getByRole('button', { name: 'Collapse menu' });
    expect(toggle).toHaveAttribute('aria-expanded', 'true');

    const container = toggle.closest('div');
    expect(container).toHaveClass('flex-row-reverse');
  });
});
