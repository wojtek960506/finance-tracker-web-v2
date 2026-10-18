import { useParams } from 'react-router-dom';

import { useRecordModals } from '@shared/hooks';

import type { SportEntry } from '../../api';
import { useSportCategories, useSportSpendingModalState } from '../../hooks';
import {
  CreateSportActivityModal,
  DeleteSportActivityModal,
  UpdateSportActivityModal,
} from '../activity-modals';
import { SportsLayout } from '../layout';
import { SportSpendingModals, toSportSpendingTarget } from '../spendings';

import { SportCategoryContent } from './sport-category-content';

export const SportCategoryPage = () => {
  const { categoryId } = useParams<{ categoryId: string }>();
  const { data: categories = [] } = useSportCategories();
  const {
    isCreateOpen,
    openCreate,
    closeCreate,
    editingItem,
    openEdit,
    closeEdit,
    deletingItem,
    openDelete,
    closeDelete,
  } = useRecordModals<SportEntry>();

  const {
    linkingTargets,
    unlinkingTarget,
    openLink,
    closeLink,
    openUnlink,
    closeUnlink,
  } = useSportSpendingModalState();

  const handleLinkActivity = (item: SportEntry) => {
    openLink(toSportSpendingTarget(item));
  };

  const handleUnlinkActivity = (item: SportEntry) => {
    openUnlink(toSportSpendingTarget(item));
  };

  return (
    <SportsLayout>
      <SportCategoryContent
        onAddActivity={openCreate}
        onEditActivity={openEdit}
        onDeleteActivity={openDelete}
        onLinkActivity={handleLinkActivity}
        onUnlinkActivity={handleUnlinkActivity}
      />
      <CreateSportActivityModal
        isOpen={isCreateOpen}
        onClose={closeCreate}
        defaultCategoryId={categoryId}
        categories={categories}
      />
      <UpdateSportActivityModal
        isOpen={Boolean(editingItem)}
        onClose={closeEdit}
        categories={categories}
        item={editingItem}
      />
      <DeleteSportActivityModal
        isOpen={Boolean(deletingItem)}
        onClose={closeDelete}
        item={deletingItem}
      />
      <SportSpendingModals
        linkingTargets={linkingTargets}
        unlinkingTarget={unlinkingTarget}
        onCloseLink={closeLink}
        onCloseUnlink={closeUnlink}
      />
    </SportsLayout>
  );
};
