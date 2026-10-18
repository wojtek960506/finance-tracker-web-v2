import { useParams } from 'react-router-dom';

import { useRecordModals } from '@shared/hooks';

import type { SportEntry } from '../../api';
import { useSportCategories } from '../../hooks';
import {
  CreateSportActivityModal,
  DeleteSportActivityModal,
  UpdateSportActivityModal,
} from '../activity-modals';
import { SportsLayout } from '../layout';

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

  return (
    <SportsLayout>
      <SportCategoryContent
        onAddActivity={openCreate}
        onEditActivity={openEdit}
        onDeleteActivity={openDelete}
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
    </SportsLayout>
  );
};
