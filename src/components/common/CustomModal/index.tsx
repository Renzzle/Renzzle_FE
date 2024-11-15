import React from 'react';
import { Modal, useWindowDimensions, View } from 'react-native';
import { CenteredView, ModalBodyContainer, ModalBottomContainer, ModalContainer, ModalExitContainer, ModalTitleContainer, ModalTopContainer } from './index.styles';
import CustomText from '../CustomText';
import Button from '../Button';
import { BellIcon, LogoutIcon } from '../Icons';

export type ModalCategoryType =
  | 'LESSON_PUZZLE_SUCCESS'
  | 'COMMUNITY_PUZZLE_SUCCESS'
  | 'AI_PUZZLE_SUCCESS'
  | 'PUZZLE_FAILURE'
  | 'VALIDATION_COMPLETE'
  | 'VALIDATION_FAILED';

export const MODAL_TEXTS = {
  LESSON_PUZZLE_SUCCESS: {
    TITLE: '퍼즐 풀기 성공',
    BODY: '오목을 완성하였습니다!',
    FOOTER: '다음문제',
  },
  COMMUNITY_PUZZLE_SUCCESS: {
    TITLE: '퍼즐 풀기 성공',
    BODY: '오목을 완성하였습니다!',
    FOOTER: '나가기',
  },
  AI_PUZZLE_SUCCESS: {
    TITLE: '퍼즐 풀기 성공',
    BODY: '오목을 완성하였습니다!',
    FOOTER: '나가기',
  },
  PUZZLE_FAILURE: {
    TITLE: '퍼즐 풀기 실패',
    BODY: '수 제한 이내에 오목을 만들지 못하였습니다.',
    FOOTER: ['재시도', '나가기'],
  },
  VALIDATION_COMPLETE: {
    TITLE: '검증이 완료되었습니다.',
    BODY: '업로드하시겠습니까?',
    FOOTER: ['취소', '업로드'],
  },
  VALIDATION_FAILED: {
    TITLE: '검증이 실패하였습니다.',
    BODY: '다시 시도해 주세요.',
    FOOTER: '확인',
  },
};

interface CustomModalProps {
  category: ModalCategoryType | null;
  isVisible: boolean;
  onPrimaryAction: () => void;
  onSecondaryAction?: () => void;
  bodyText?: string;
}

export const ModalCard = ({
  category,
  onPrimaryAction: onPrimaryClose,
  onSecondaryAction: onSecondaryClose = () => {},
}: Omit<CustomModalProps, 'isVisible'>) => {
  const { width } = useWindowDimensions();

  if (!category) {
    return <View />;
  }
  const {
    TITLE: titleText,
    BODY: bodyText,
    FOOTER: footerTexts,
  } = MODAL_TEXTS[category];

  const title = (
    <ModalTopContainer>
      <ModalTitleContainer>
        <BellIcon />
        <CustomText size={18} weight="bold" lineHeight="sm">
          {titleText}
        </CustomText>
      </ModalTitleContainer>
      {category === 'AI_PUZZLE_SUCCESS' ? (
        <ModalExitContainer onPress={onPrimaryClose}>
          {/* TODO: onPress 출제화면으로 이동 */}
          <CustomText size={12} lineHeight="sm" color="gray/gray600">
            바로출제
          </CustomText>
          <LogoutIcon color="gray/gray400" />
        </ModalExitContainer>
      ) : (
        <View />
      )}

    </ModalTopContainer>
  );

  const body = (
    <ModalBodyContainer>
      <CustomText
        size={14}
        lineHeight="lg"
        color="gray/gray600"
      >
        {bodyText}
      </CustomText>
    </ModalBodyContainer>
  );

  const footer =
    typeof footerTexts === 'string' ? (
      <ModalBottomContainer>
        <Button category="primary" onPress={onPrimaryClose}>
          {footerTexts}
        </Button>
      </ModalBottomContainer>
    ) : (
      <ModalBottomContainer>
        <Button category="secondary" onPress={onSecondaryClose}>
          {footerTexts[0]}
        </Button>
        <Button category="primary" onPress={onPrimaryClose}>
          {footerTexts[1]}
        </Button>
      </ModalBottomContainer>
    );

  return (
    <CenteredView>
      <ModalContainer screenWidth={width}>
        {title}
        {body}
        {footer}
      </ModalContainer>
    </CenteredView>
  );
};

const CustomModal = ({ isVisible, ...props }: CustomModalProps) => {
  return (
    <Modal
      visible={isVisible}
      transparent={true}
      animationType="fade"
    >
      {isVisible && (
        <ModalCard {...props} />
      )}
    </Modal>
  );
};

export default CustomModal;
