import React from 'react';
import { Modal, useWindowDimensions } from 'react-native';
import { CenteredView, ModalBodyContainer, ModalBottomContainer, ModalContainer, ModalExitContainer, ModalTitleContainer, ModalTopContainer } from './index.styles';
import CustomText from '../CustomText';
import Button from '../Button';
import { BellIcon, CloseIcon } from '../Icons';

interface CustomModalProps {
  isVisible: boolean;
  closeModal: () => void;
}

const CustomModal = ({ isVisible, closeModal }: CustomModalProps) => {
  const { width } = useWindowDimensions();

  return (
    <Modal
      visible={isVisible}
      transparent={true}
      animationType="fade"
      onRequestClose={closeModal}
    >
      {isVisible && (
        <CenteredView>
          <ModalContainer screenWidth={width}>
            <ModalTopContainer>
              <ModalTitleContainer>
                <BellIcon />
                <CustomText
                  size={18}
                  weight="bold"
                  lineHeight="sm"
                >
                  검증이 완료되었습니다.
                </CustomText>
              </ModalTitleContainer>
              <ModalExitContainer onPress={closeModal}>
                <CustomText
                  size={12}
                  lineHeight="sm"
                  color="gray/gray500"
                >
                  나가기
                </CustomText>
                <CloseIcon />
              </ModalExitContainer>
            </ModalTopContainer>

            <ModalBodyContainer>
              <CustomText
                size={14}
                lineHeight="lg"
                color="gray/gray600"
              >
                흑선승 VCF (작성자: isoo)
              </CustomText>
            </ModalBodyContainer>

            <ModalBottomContainer>
              <Button
                category="primary"
              >
                취소
              </Button>
              <Button
                category="secondary"
              >
                업로드
              </Button>
            </ModalBottomContainer>
          </ModalContainer>
        </CenteredView>
      )}
    </Modal>
  );
};

export default CustomModal;
