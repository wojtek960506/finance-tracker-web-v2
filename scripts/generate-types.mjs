import { execSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import 'dotenv/config';

// Path to the local backend OpenAPI schema file, defined in .env via VITE_OPENAPI_SPEC_PATH.
// This script runs locally in Husky's pre-commit hook or manually via "pnpm generate:types".
const openapiPath = process.env.VITE_OPENAPI_SPEC_PATH || process.env.OPENAPI_SPEC_PATH;

if (!openapiPath) {
  // Guard: gracefully skip if VITE_OPENAPI_SPEC_PATH is missing from .env
  console.log(
    'Skipping openapi-typescript generation: VITE_OPENAPI_SPEC_PATH is not defined in environment variables.',
  );
} else if (!existsSync(openapiPath)) {
  // Guard: gracefully skip if the local backend schema file is absent
  console.log(
    `Skipping openapi-typescript generation: OpenAPI spec file not found at "${openapiPath}".`,
  );
} else {
  console.log(`Generating API types from "${openapiPath}"...`);
  execSync(`npx openapi-typescript ${openapiPath} -o src/shared/types/api.generated.ts`, {
    stdio: 'inherit',
  });
}
