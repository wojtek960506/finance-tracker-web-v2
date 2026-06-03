import type { INamedResource, NamedResourceKind } from '@named-resources/api';

import { NamedResourcePreview } from '../named-resource-preview';

export const NamedResourcesList = ({
  kind,
  sortedResources,
}: {
  kind: NamedResourceKind;
  sortedResources: INamedResource[];
}) => (
  <ul className="flex flex-col gap-2 sm:gap-3">
    {sortedResources.map((namedResource) => (
      <NamedResourcePreview
        key={namedResource.id}
        kind={kind}
        namedResource={namedResource}
      />
    ))}
  </ul>
);
