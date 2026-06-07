export const getNamedResourceDisplayLabel = (
  resource: { name: string; type: 'system' | 'user' },
  tNamedResource: (key: string) => string,
) => (resource.type === 'system' ? tNamedResource(resource.name) : resource.name);
