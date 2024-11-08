import { useCallback, useState } from 'react';

interface UseModalReturn {
  isModalVisible: boolean;
  openModal: () => void;
  closeModal: () => void;
}

const useModal = (): UseModalReturn => {
  const [isModalVisible, setIsModalVisible] = useState(false);

  const openModal = useCallback(() => setIsModalVisible(true), []);
  const closeModal = useCallback(() => setIsModalVisible(false), []);
  return { isModalVisible, openModal, closeModal };
};

export default useModal;
