import { Card } from '../card';
import { LoadingState } from '../loading-state';

type LoadingCardProps = {
  title: string;
  description?: string;
  widthClassName?: string;
  cardClassName?: string;
  loadingStateClassName?: string;
};

const DEFAULT_WRAPPER_CLASS_NAME = 'mx-auto flex w-full flex-col gap-2 sm:gap-3';
const DEFAULT_CARD_CLASS_NAME =
  'gap-4 rounded-3xl border-fg/20 bg-modal-bg/95 p-6 sm:p-8';
const DEFAULT_LOADING_STATE_CLASS_NAME = 'py-4';

export const LoadingCard = ({
  title,
  description,
  widthClassName,
  cardClassName,
  loadingStateClassName,
}: LoadingCardProps) => {
  const content = (
    <Card className={cardClassName ?? DEFAULT_CARD_CLASS_NAME}>
      <LoadingState
        title={title}
        description={description}
        className={loadingStateClassName ?? DEFAULT_LOADING_STATE_CLASS_NAME}
      />
    </Card>
  );

  if (!widthClassName) return content;

  return (
    <div className={`${DEFAULT_WRAPPER_CLASS_NAME} ${widthClassName}`}>{content}</div>
  );
};
