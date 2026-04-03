import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { NamedResourceInput } from './named-resource-input';

describe('NamedResourceInput', () => {
  const action = vi.fn<(name: string) => Promise<void>>();
  const onError = vi.fn();
  const setIsVisible = vi.fn();

  beforeEach(() => {
    action.mockReset();
    onError.mockReset();
    setIsVisible.mockReset();
  });

  it('submits entered value and closes by default in create mode', async () => {
    const user = userEvent.setup();
    const inputRef = createRef<HTMLInputElement>();

    action.mockResolvedValueOnce();

    render(
      <NamedResourceInput
        inputRef={inputRef}
        initialValue=""
        action={action}
        onError={onError}
        setIsVisible={setIsVisible}
        isCreate
      />,
    );

    const input = screen.getByRole('textbox');
    await user.type(input, 'Groceries');
    await user.click(screen.getAllByRole('button')[0]);

    await waitFor(() => expect(action).toHaveBeenCalledWith('Groceries'));
    expect(setIsVisible).toHaveBeenCalledWith(false);
    expect(input).toHaveValue('');
  });

  it('submits with Enter and stays open when auto close is disabled', async () => {
    const user = userEvent.setup();
    const inputRef = createRef<HTMLInputElement>();

    action.mockResolvedValueOnce();

    render(
      <NamedResourceInput
        inputRef={inputRef}
        initialValue="Old name"
        action={action}
        setIsVisible={setIsVisible}
        isCreate={false}
        autoCloseOnSubmit={false}
      />,
    );

    const input = screen.getByRole('textbox');
    await user.clear(input);
    await user.type(input, 'Updated name{Enter}');

    await waitFor(() => expect(action).toHaveBeenCalledWith('Updated name'));
    expect(setIsVisible).not.toHaveBeenCalled();
    expect(input).toHaveValue('Updated name');
  });

  it('closes and resets value on Escape', async () => {
    const user = userEvent.setup();
    const inputRef = createRef<HTMLInputElement>();

    render(
      <NamedResourceInput
        inputRef={inputRef}
        initialValue="Initial name"
        action={action}
        setIsVisible={setIsVisible}
        isCreate={false}
      />,
    );

    const input = screen.getByRole('textbox');
    await user.clear(input);
    await user.type(input, 'Changed name{Escape}');

    expect(setIsVisible).toHaveBeenCalledWith(false);
    expect(input).toHaveValue('Initial name');
  });

  it('closes and resets value when cancel is clicked', async () => {
    const user = userEvent.setup();
    const inputRef = createRef<HTMLInputElement>();

    render(
      <NamedResourceInput
        inputRef={inputRef}
        initialValue="Initial name"
        action={action}
        setIsVisible={setIsVisible}
        isCreate={false}
      />,
    );

    const input = screen.getByRole('textbox');
    await user.clear(input);
    await user.type(input, 'Changed name');
    await user.click(screen.getAllByRole('button')[1]);

    expect(setIsVisible).toHaveBeenCalledWith(false);
    expect(input).toHaveValue('Initial name');
  });

  it('reports errors and refocuses the input for retry', async () => {
    const user = userEvent.setup();
    const inputRef = createRef<HTMLInputElement>();
    const selectSpy = vi.spyOn(HTMLInputElement.prototype, 'select');
    const error = new Error('Name exists');

    action.mockRejectedValueOnce(error);

    render(
      <NamedResourceInput
        inputRef={inputRef}
        initialValue=""
        action={action}
        onError={onError}
        setIsVisible={setIsVisible}
        isCreate
      />,
    );

    const input = screen.getByRole('textbox');
    await user.type(input, 'Groceries');
    await user.click(screen.getAllByRole('button')[0]);

    await waitFor(() => expect(onError).toHaveBeenCalledWith(error));
    expect(input).toHaveFocus();
    expect(selectSpy).toHaveBeenCalled();
    expect(input.className).toContain('shake');
  });

  it('shows a loading state while submitting', async () => {
    const user = userEvent.setup();
    const inputRef = createRef<HTMLInputElement>();

    let resolveAction: (() => void) | undefined;
    action.mockImplementationOnce(
      () =>
        new Promise<void>((resolve) => {
          resolveAction = resolve;
        }),
    );

    render(
      <NamedResourceInput
        inputRef={inputRef}
        initialValue=""
        action={action}
        setIsVisible={setIsVisible}
        isCreate
      />,
    );

    const input = screen.getByRole('textbox');
    await user.type(input, 'Groceries');
    await user.click(screen.getAllByRole('button')[0]);

    expect(input).toBeDisabled();
    expect(screen.getAllByRole('button')[0]).toBeDisabled();
    expect(screen.getAllByRole('button')[1]).toBeDisabled();
    expect(document.querySelector('svg.animate-spin')).toBeInTheDocument();

    resolveAction?.();

    await waitFor(() => expect(input).not.toBeDisabled());
  });

  it('does not submit an empty value', async () => {
    const user = userEvent.setup();
    const inputRef = createRef<HTMLInputElement>();

    render(
      <NamedResourceInput
        inputRef={inputRef}
        initialValue=""
        action={action}
        setIsVisible={setIsVisible}
        isCreate
      />,
    );

    const input = screen.getByRole('textbox');

    expect(screen.getAllByRole('button')[0]).toBeDisabled();
    input.focus();

    await user.keyboard('{Enter}');

    expect(action).not.toHaveBeenCalled();
  });
});
