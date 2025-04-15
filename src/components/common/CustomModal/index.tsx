import React from 'react';
import { Modal, useWindowDimensions, View } from 'react-native';
import {
  CenteredView,
  ModalBodyContainer,
  ModalBottomContainer,
  ModalContainer,
  ModalTitleContainer,
  ModalTopContainer,
} from './index.styles';
import CustomText from '../CustomText';
import CustomButton from '../CustomButton';
import { useTranslation } from 'react-i18next';

export type ModalCategoryType =
  | 'TRAINING_PUZZLE_SUCCESS'
  | 'COMMUNITY_PUZZLE_SUCCESS'
  | 'RANKING_PUZZLE_SUCCESS'
  | 'PUZZLE_FAILURE'
  | 'VALIDATION_COMPLETE'
  | 'VALIDATION_FAILED';

export const MODAL_TEXTS = {
  TRAINING_PUZZLE_SUCCESS: {
    TITLE: 'modal.trainingPuzzleSuccess.title',
    BODY: 'modal.trainingPuzzleSuccess.message',
    FOOTER: ['modal.trainingPuzzleSuccess.cancel', 'modal.trainingPuzzleSuccess.confirm'],
  },
  COMMUNITY_PUZZLE_SUCCESS: {
    TITLE: 'modal.communityPuzzleSuccess.title',
    BODY: 'modal.communityPuzzleSuccess.message',
    FOOTER: 'modal.communityPuzzleSuccess.confirm',
  },
  RANKING_PUZZLE_SUCCESS: {
    TITLE: 'modal.rankingPuzzleSuccess.title',
    BODY: 'modal.rankingPuzzleSuccess.message',
    FOOTER: 'modal.rankingPuzzleSuccess.confirm',
  },
  PUZZLE_FAILURE: {
    TITLE: 'modal.PuzzleFailure.title',
    BODY: 'modal.PuzzleFailure.message',
    FOOTER: 'modal.PuzzleFailure.confirm',
  },
  VALIDATION_COMPLETE: {
    TITLE: 'modal.validationComplete.title',
    BODY: 'modal.validationComplete.message',
    FOOTER: ['modal.validationComplete.cancel', 'modal.trainingPuzzleSuccess.confirm'],
  },
  VALIDATION_FAILED: {
    TITLE: 'modal.validationFailed.title',
    BODY: 'modal.validationFailed.message',
    FOOTER: 'modal.validationFailed.confirm',
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
  const { t } = useTranslation();

  if (!category) {
    return <View />;
  }
  const { TITLE: titleText, BODY: bodyText, FOOTER: footerTexts } = MODAL_TEXTS[category];

  const title = (
    <ModalTopContainer>
      <ModalTitleContainer>
        <CustomText size={18} weight="bold" lineHeight="sm">
          {t(titleText)}
        </CustomText>
      </ModalTitleContainer>
      {category === 'RANKING_PUZZLE_SUCCESS' ? (
        // <ModalExitContainer onPress={onPrimaryClose}>
        //   {/* TODO: onPress 출제화면으로 이동 */}
        //   <CustomText size={12} lineHeight="sm" color="gray/gray600">
        //     바로출제
        //   </CustomText>
        //   <LogoutIcon color="gray/gray400" />
        // </ModalExitContainer>
        <View />
      ) : (
        <View />
      )}
    </ModalTopContainer>
  );

  const body = (
    <ModalBodyContainer>
      <CustomText size={14} lineHeight="lg" color="gray/gray600">
        {t(bodyText)}
      </CustomText>
    </ModalBodyContainer>
  );

  const footer =
    typeof footerTexts === 'string' ? (
      <ModalBottomContainer>
        <CustomButton category="primary" onPress={onPrimaryClose}>
          {t(footerTexts)}
        </CustomButton>
      </ModalBottomContainer>
    ) : (
      <ModalBottomContainer>
        <CustomButton category="secondary" onPress={onSecondaryClose}>
          {t(footerTexts[0])}
        </CustomButton>
        <CustomButton category="primary" onPress={onPrimaryClose}>
          {t(footerTexts[1])}
        </CustomButton>
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
    <Modal visible={isVisible} transparent={true} animationType="fade">
      {isVisible && <ModalCard {...props} />}
    </Modal>
  );
};

export default CustomModal;
