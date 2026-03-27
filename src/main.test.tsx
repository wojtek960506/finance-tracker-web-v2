import { beforeEach, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({
  render: vi.fn(),
  createRoot: vi.fn(() => ({ render: mocks.render })),
}));

vi.mock('react-dom/client', () => ({
  createRoot: mocks.createRoot,
}));

vi.mock('@app/App.tsx', () => ({
  default: () => null,
}));

vi.mock('@tanstack/react-query-devtools', () => ({
  ReactQueryDevtools: () => null,
}));

vi.mock('@shared/i18n', () => ({}));
vi.mock('./index.css', () => ({}));

describe('main', () => {
  beforeEach(() => {
    mocks.render.mockClear();
    mocks.createRoot.mockClear();
    document.body.innerHTML = '<div id="root"></div>';
    vi.resetModules();
  });

  it('creates the react root and renders the app tree', async () => {
    await import('./main');

    const root = document.getElementById('root');
    expect(mocks.createRoot).toHaveBeenCalledWith(root);
    expect(mocks.render).toHaveBeenCalledOnce();
  });
});
