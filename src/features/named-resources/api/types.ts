import type { components } from '@shared/types/api.generated';

import type { NAMED_RESOURCE } from './consts';

export type NamedResourceType = components['schemas']['NamedResourceResponse']['type'];

export type INamedResource = components['schemas']['NamedResourceResponse'];

export type NamedResourceKind = keyof typeof NAMED_RESOURCE;

export type DeleteResponse = {
  acknowledged: boolean;
  deletedCount: number;
};
