import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Check, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

import {
  getNamedResources,
  NAMED_RESOURCE,
  type NamedResourceKind,
} from '@named-resources/api';
import { createNamedResource } from '@named-resources/api';
import { MAIN_BUTTON_TEXT } from '@shared/consts';

import { NamedResourcePreview } from './named-resource-preview';

import { Button, Card, Input } from '@/shared/ui';

const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);

export const NamedResourcesList = ({ kind }: { kind: NamedResourceKind }) => {
  const { t } = useTranslation(kind);

  const inputRef = useRef<HTMLInputElement | null>(null);

  const [isCreating, setIsCreating] = useState(false);
  const [newResourceName, setNewResourceName] = useState("");

  const queryClient = useQueryClient();
  // TODO handle errors while creating
  const createMutation = useMutation({
    mutationFn: async (name: string) => await createNamedResource(kind, name),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [kind]}),
  });

  useEffect(() => {
    if (isCreating) inputRef.current!.focus();
  }, [isCreating]);

  const { data, isLoading, error } = useQuery({
    queryKey: [kind],
    queryFn: async () => await getNamedResources(kind),
  });

  if (isLoading) return <p>Loading</p>;
  if (error) return <p>{error.message}</p>;
  if (!data || data.length === 0)
    return <p>There are no {kind} - TODO add button to create one</p>;

  return (
    <div className="flex flex-col gap-2 sm:gap-3 max-w-100 m-auto">
      <Button
        variant="primary"
        className={MAIN_BUTTON_TEXT}
        disabled={isCreating}
        onClick={() => setIsCreating(true)}
      >
        {t(`new${capitalize(NAMED_RESOURCE[kind])}`)}
      </Button>


      {isCreating && <Card className="flex-row">
        <Input
          ref={inputRef}
          value={newResourceName}
          onChange={event => setNewResourceName(event.target.value)}  
        />
        <Button
          disabled={newResourceName === ""}
          variant="primary"
          onClick={() => {
            createMutation.mutate(newResourceName);
            setIsCreating(false);
            setNewResourceName("");
          }}
        >
          <Check />
        </Button>
        <Button
          variant="destructive"
          onClick={() => {
            setIsCreating(false);
            setNewResourceName("");
          }}
        >
          <X />
        </Button>
      </Card>}

      <ul className="flex flex-col gap-2 sm-gap-3">
        {data.map((namedResource) => (
          <NamedResourcePreview
            key={namedResource.id}
            kind={kind}
            namedResource={namedResource}
          />
        ))}
      </ul>
    </div>
  );
};
