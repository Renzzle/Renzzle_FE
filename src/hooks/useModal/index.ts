import { useRef, useState } from 'react';
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
  // 버튼 동작이 끝날 때까지 모달이 열려 있으므로, 그동안 다시 누른 것은 무시한다
  const isClosingRef = useRef(false);

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

  const runCloseAction = async (action?: () => void | Promise<void>) => {
    if (isClosingRef.current) {
      return;
    }

    isClosingRef.current = true;
    try {
      if (action) {
        await action();
      }
      closeModal();
    } finally {
      isClosingRef.current = false;
    }
  };

  const closePrimarily = () => runCloseAction(primaryAction);

  const closeSecondarily = () => runCloseAction(secondaryAction);

  return {
    isModalVisible,
    category,
    activateModal,
    closeModal,
    closePrimarily,
    closeSecondarily,
  };
};

export default useModal;
