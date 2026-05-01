# Finance Tracker Web V2

Frontend for a personal finance tracker built with React, TypeScript, Vite, React Router, React Query, Tailwind CSS, and Vitest.

## Features

- Authentication flow with login and registration screens
- Transactions list, filters, details, create, update, and trash views
- Named resource management for categories, payment methods, and accounts
- Internationalization support
- Unit and component tests with Vitest and Testing Library

## Requirements

- Node.js 20+
- pnpm
- A running backend API

## Getting started

1. Install dependencies:

```bash
pnpm install
```

2. Create your local env file from the example:

```bash
cp .env.example .env
```

3. Update `VITE_API_BASE_URL` in `.env` to point to your backend.

4. Start the development server:

```bash
pnpm dev
```

## Environment variables

This app uses Vite env variables, so every client-side variable must start with `VITE_`.

### `VITE_API_BASE_URL`

Base URL of the backend server, without the `/api` suffix. The frontend appends `/api` automatically.

Examples:

- Local backend:

```env
VITE_API_BASE_URL=http://localhost:5000
```

- Hosted backend on a separate domain:

```env
VITE_API_BASE_URL=https://api.example.com
```

- Backend available on the same domain behind a reverse proxy:

```env
VITE_API_BASE_URL=/
```

Notes:

- Trailing slashes are removed automatically.
- If `VITE_API_BASE_URL` is missing or blank, the app falls back to `http://localhost:5000`.

## Available scripts

- `pnpm dev` starts the Vite dev server
- `pnpm build` runs TypeScript compilation and creates a production build
- `pnpm preview` serves the production build locally
- `pnpm lint` runs ESLint
- `pnpm lint:fix` runs ESLint with automatic fixes
- `pnpm format` checks Prettier formatting
- `pnpm format:fix` writes Prettier formatting changes
- `pnpm test` runs the test suite once
- `pnpm test:watch` runs tests in watch mode
- `pnpm test:coverage` runs tests with coverage

## Production deployment

This project is a client-side React SPA built with Vite, so it works well on static hosts such as Vercel, Netlify, or Cloudflare Pages.

For deployment:

1. Set `VITE_API_BASE_URL` in your hosting provider's environment settings.
2. Ensure your host serves `index.html` for client-side routes like `/transactions`.
3. Build with:

```bash
pnpm build
```

The production assets are generated in `dist/`.
