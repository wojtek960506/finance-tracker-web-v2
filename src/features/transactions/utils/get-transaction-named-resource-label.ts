import type { NamedResource } from '@transactions/api';

export const getTransactionNamedResourceLabel = (
  resource: Pick<NamedResource, "type" | "name">,
  tNamedResources: (key: string) => string,
) => (resource.type === 'system' ? tNamedResources(resource.name) : resource.name);
