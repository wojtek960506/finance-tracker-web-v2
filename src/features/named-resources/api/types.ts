import type { NAMED_RESOURCE } from './consts';

export type NamedResourceType = 'user' | 'system';

export interface INamedResource {
  name: string;
  id: string;
  ownerId: string;
  type: NamedResourceType;
  nameNormalized: string;
}

export type NamedResourceKind = keyof typeof NAMED_RESOURCE;
