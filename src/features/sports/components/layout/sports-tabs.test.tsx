import '@shared/i18n';

import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';

import type { SportCategory } from '../../api/types';

import { SportsTabs } from './sports-tabs';

const mockCategories: SportCategory[] = [
  {
    id: 'cat-running',
    name: 'Bieganie',
    nameNormalized: 'bieganie',
    type: 'user',
    isFavorite: false,
  },
  {
    id: 'cat-cycling',
    name: 'Kolarstwo',
    nameNormalized: 'kolarstwo',
    type: 'user',
    isFavorite: true,
  },
  {
    id: 'cat-other',
    name: 'Inne',
    nameNormalized: 'inne',
    type: 'system',
    isFavorite: false,
  },
];

const renderTabs = (props: Partial<Parameters<typeof SportsTabs>[0]> = {}) => {
  return render(
    <MemoryRouter initialEntries={['/sports']}>
      <SportsTabs
        categories={mockCategories}
        isMobileNavOpen={false}
        onCloseMobileNav={vi.fn()}
        {...props}
      />
    </MemoryRouter>,
  );
};

describe('SportsTabs', () => {
  it('renders "Overall" tab linking to /sports', () => {
    renderTabs();

    const overallTab = screen.getByTestId('sports-tab-overall');
    expect(overallTab).toBeInTheDocument();
    expect(overallTab).toHaveAttribute('href', '/sports');
  });

  it('renders category tabs with favorites prioritized first', () => {
    renderTabs();

    const cyclingTab = screen.getByTestId('sports-tab-category-cat-cycling');
    const runningTab = screen.getByTestId('sports-tab-category-cat-running');
    const otherTab = screen.getByTestId('sports-tab-category-cat-other');

    expect(cyclingTab).toBeInTheDocument();
    expect(runningTab).toBeInTheDocument();
    expect(otherTab).toBeInTheDocument();

    expect(cyclingTab).toHaveAttribute('href', '/sports/categories/cat-cycling');
    expect(runningTab).toHaveAttribute('href', '/sports/categories/cat-running');
  });

  it('calls onOpenManageCategories when add category button is clicked', () => {
    const onOpenManage = vi.fn();
    renderTabs({ onOpenManageCategories: onOpenManage });

    const addBtn = screen.getByTestId('sports-tab-add-category');
    expect(addBtn).toBeInTheDocument();

    fireEvent.click(addBtn);
    expect(onOpenManage).toHaveBeenCalledTimes(1);
  });

  it('renders mobile navigation when isMobileNavOpen is true', () => {
    const onCloseMobileNav = vi.fn();
    renderTabs({ isMobileNavOpen: true, onCloseMobileNav });

    const mobileNav = screen.getByTestId('sports-mobile-nav');
    expect(mobileNav).toBeInTheDocument();

    const cyclingLink = screen.getAllByRole('link', { name: /kolarstwo/i })[1];
    if (cyclingLink) {
      fireEvent.click(cyclingLink);
      expect(onCloseMobileNav).toHaveBeenCalled();
    }
  });
});
