import '@shared/i18n';

import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { VehicleItemActions } from './vehicle-item-actions';

describe('VehicleItemActions', () => {
  it('renders edit and delete buttons in buttons mode', () => {
    const onEdit = vi.fn();
    const onDelete = vi.fn();

    render(
      <VehicleItemActions
        onEdit={onEdit}
        onDelete={onDelete}
        editTestId="item-edit-btn"
        deleteTestId="item-delete-btn"
      />,
    );

    const editBtn = screen.getByTestId('item-edit-btn');
    const deleteBtn = screen.getByTestId('item-delete-btn');

    expect(editBtn).toBeInTheDocument();
    expect(deleteBtn).toBeInTheDocument();

    fireEvent.click(editBtn);
    expect(onEdit).toHaveBeenCalledTimes(1);

    fireEvent.click(deleteBtn);
    expect(onDelete).toHaveBeenCalledTimes(1);
  });

  it('renders dropdown menu in dropdown mode', () => {
    const onEdit = vi.fn();
    const onDelete = vi.fn();

    render(
      <VehicleItemActions
        mode="dropdown"
        onEdit={onEdit}
        onDelete={onDelete}
        menuAriaLabel="Row options"
      />,
    );

    const menuTrigger = screen.getByRole('button', { name: 'Row options' });
    expect(menuTrigger).toBeInTheDocument();
  });
});
