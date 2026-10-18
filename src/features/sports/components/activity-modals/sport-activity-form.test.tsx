import '@shared/i18n';

import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import type { SportCategory } from '../../api';

import { SportActivityForm } from './sport-activity-form';

const mockCategories: SportCategory[] = [
  {
    id: 'cat-1',
    name: 'Running',
    nameNormalized: 'running',
    type: 'system',
    isFavorite: true,
  },
  {
    id: 'cat-2',
    name: 'Cycling',
    nameNormalized: 'cycling',
    type: 'user',
    isFavorite: false,
  },
];

describe('SportActivityForm', () => {
  it('validates required item name and cost fields', async () => {
    const onSubmit = vi.fn();
    const onCancel = vi.fn();

    render(
      <SportActivityForm
        categories={mockCategories}
        mode="create"
        onSubmit={onSubmit}
        onCancel={onCancel}
      />,
    );

    const submitBtn = screen.getByTestId('sport-activity-form-submit');
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByText('Item name is required')).toBeInTheDocument();
      expect(screen.getByText('Cost must be greater than 0')).toBeInTheDocument();
    });
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('submits valid form values', async () => {
    const onSubmit = vi.fn();
    const onCancel = vi.fn();

    render(
      <SportActivityForm
        categories={mockCategories}
        defaultValues={{ categoryId: 'cat-1', date: '2026-05-10' }}
        mode="create"
        onSubmit={onSubmit}
        onCancel={onCancel}
      />,
    );

    const nameInput = screen.getByTestId('sport-activity-item-name-input');
    fireEvent.change(nameInput, { target: { value: 'Marathon Entry Fee' } });

    const costInput = screen.getByTestId('sport-activity-cost-input');
    fireEvent.change(costInput, { target: { value: '180' } });

    const submitBtn = screen.getByTestId('sport-activity-form-submit');
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith({
        categoryId: 'cat-1',
        date: '2026-05-10',
        itemName: 'Marathon Entry Fee',
        costPln: 180,
        description: null,
        transactionId: null,
      });
    });
  });

  it('calls onCancel callback when Cancel is clicked', () => {
    const onSubmit = vi.fn();
    const onCancel = vi.fn();

    render(
      <SportActivityForm
        categories={mockCategories}
        mode="create"
        onSubmit={onSubmit}
        onCancel={onCancel}
      />,
    );

    const cancelBtn = screen.getByTestId('sport-activity-form-cancel');
    fireEvent.click(cancelBtn);

    expect(onCancel).toHaveBeenCalled();
  });

  it('prevents form submission on Enter keydown', () => {
    const onSubmit = vi.fn();
    const onCancel = vi.fn();

    render(
      <SportActivityForm
        categories={mockCategories}
        mode="create"
        onSubmit={onSubmit}
        onCancel={onCancel}
      />,
    );

    const nameInput = screen.getByTestId('sport-activity-item-name-input');
    fireEvent.keyDown(nameInput, { key: 'Enter', code: 'Enter' });

    expect(onSubmit).not.toHaveBeenCalled();
  });
});
