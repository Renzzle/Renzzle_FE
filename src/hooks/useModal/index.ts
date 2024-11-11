import { useState } from 'react';
import { ModalCategoryType } from '../../components/common/CustomModal';
import { CloseActionsType } from './index.types';

const useModal = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [category, setCategory] = useState<ModalCategoryType | null>(null);
  const [closeActions, setCloseActions] = useState<CloseActionsType>({
    primaryAction: () => {},
    secondaryAction: () => {},
  });

  const { primaryAction, secondaryAction } = closeActions;

  const onToggle = () => {
    setIsModalVisible((currentIsModalOpen) => !currentIsModalOpen);
  };

  const activateModal = (
    newCategory: ModalCategoryType,
    newCloseActions: CloseActionsType,
  ) => {
    setCategory(newCategory);
    setCloseActions(newCloseActions);
    onToggle();
  };

  const closePrimarily = async () => {
    await primaryAction();
    onToggle();
  };

  const closeSecondarily = () => {
    if (secondaryAction) {
      secondaryAction();
    }
    onToggle();
  };

  return {
    isModalVisible,
    category,
    activateModal,
    closePrimarily,
    closeSecondarily,
  };
};

export default useModal;
