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

  const openModal = () => {
    setIsModalVisible(true);
  };

  const closeModal = () => {
    setIsModalVisible(false);
  };

  const activateModal = (newCategory: ModalCategoryType, newCloseActions: CloseActionsType) => {
    setCategory(newCategory);
    setCloseActions(newCloseActions);
    openModal();
  };

  const closePrimarily = async () => {
    await primaryAction();
    closeModal();
  };

  const closeSecondarily = async () => {
    if (secondaryAction) {
      await secondaryAction();
    }
    closeModal();
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
