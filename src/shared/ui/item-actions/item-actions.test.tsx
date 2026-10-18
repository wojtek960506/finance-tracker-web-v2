import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { ItemActions } from './item-actions';

describe('ItemActions', () => {
  it('renders edit and delete buttons in buttons mode', () => {
    const onEdit = vi.fn();
    const onDelete = vi.fn();

    render(
      <ItemActions
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
    const onLink = vi.fn();

    render(
      <ItemActions
        mode="dropdown"
        onEdit={onEdit}
        onDelete={onDelete}
        onLink={onLink}
        menuAriaLabel="Row options"
      />,
    );

    const menuTrigger = screen.getByRole('button', { name: 'Row options' });
    expect(menuTrigger).toBeInTheDocument();

    fireEvent.click(menuTrigger);
    const linkOption = screen.getByText('Link to transaction');
    expect(linkOption).toBeInTheDocument();

    fireEvent.click(linkOption);
    expect(onLink).toHaveBeenCalledTimes(1);
  });

  it('renders unlink option in dropdown menu when onUnlink is provided', () => {
    const onUnlink = vi.fn();

    render(
      <ItemActions mode="dropdown" onUnlink={onUnlink} menuAriaLabel="Row options" />,
    );

    const menuTrigger = screen.getByRole('button', { name: 'Row options' });
    fireEvent.click(menuTrigger);

    const unlinkOption = screen.getByText('Unlink from transaction');
    expect(unlinkOption).toBeInTheDocument();

    fireEvent.click(unlinkOption);
    expect(onUnlink).toHaveBeenCalledTimes(1);
  });

  it('renders link and unlink buttons in buttons mode with appropriate styles', () => {
    const onLink = vi.fn();
    const onUnlink = vi.fn();

    render(
      <ItemActions
        onLink={onLink}
        onUnlink={onUnlink}
        linkTestId="link-btn"
        unlinkTestId="unlink-btn"
      />,
    );

    const linkBtn = screen.getByTestId('link-btn');
    const unlinkBtn = screen.getByTestId('unlink-btn');

    expect(linkBtn).toHaveClass('bg-bt-primary');
    expect(unlinkBtn).toHaveClass('bg-warning');

    fireEvent.click(linkBtn);
    expect(onLink).toHaveBeenCalledTimes(1);

    fireEvent.click(unlinkBtn);
    expect(onUnlink).toHaveBeenCalledTimes(1);
  });

  it('returns null when no action callbacks are provided', () => {
    const { container } = render(<ItemActions />);
    expect(container.firstChild).toBeNull();
  });

  it('uses custom labels when provided', () => {
    const onEdit = vi.fn();

    render(
      <ItemActions onEdit={onEdit} editLabel="Modifier" editTestId="custom-edit-btn" />,
    );

    const editBtn = screen.getByTestId('custom-edit-btn');
    expect(editBtn).toHaveAttribute('title', 'Modifier');
    expect(editBtn).toHaveAttribute('aria-label', 'Modifier');
  });
});
