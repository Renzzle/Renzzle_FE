import React from 'react';
import { Modal, View } from 'react-native';
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
import useDeviceWidth from '../../../hooks/useDeviceWidth';
import { GameOutcome } from '../../types/Ranking';

export type ModalCategoryType =
  | 'TRAINING_PUZZLE_SUCCESS'
  | 'COMMUNITY_PUZZLE_SUCCESS'
  | 'RANKING_PUZZLE_SUCCESS'
  | 'PUZZLE_FAILURE'
  | 'VALIDATION_COMPLETE'
  | 'VALIDATION_FAILED'
  | 'PUZZLE_UPLOAD_SUCCESS'
  | 'PUZZLE_UPLOAD_FAILED'
  | 'DELETE_PUZZLE_CONFIRM'
  | 'RANKING_PUZZLE_INTRO'
  | 'RANKING_PUZZLE_OUTRO'
  | 'TRAINING_PACK_PURCHASE'
  | 'PUZZLE_REVIEW_PURCHASE'
  | 'FEATURE_IN_PROGRESS';

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
    TITLE: 'modal.puzzleFailure.title',
    BODY: 'modal.puzzleFailure.message',
    FOOTER: 'modal.puzzleFailure.confirm',
  },
  VALIDATION_COMPLETE: {
    TITLE: 'modal.validationComplete.title',
    BODY: 'modal.validationComplete.message',
    FOOTER: 'modal.validationComplete.confirm',
  },
  VALIDATION_FAILED: {
    TITLE: 'modal.validationFailed.title',
    BODY: 'modal.validationFailed.message',
    FOOTER: 'modal.validationFailed.confirm',
  },
  PUZZLE_UPLOAD_SUCCESS: {
    TITLE: 'modal.puzzleUploadSuccess.title',
    BODY: 'modal.puzzleUploadSuccess.message',
    FOOTER: 'modal.puzzleUploadSuccess.confirm',
  },
  PUZZLE_UPLOAD_FAILED: {
    TITLE: 'modal.puzzleUploadFailed.title',
    BODY: 'modal.puzzleUploadFailed.message',
    FOOTER: 'modal.puzzleUploadFailed.confirm',
  },
  DELETE_PUZZLE_CONFIRM: {
    TITLE: 'modal.deletePuzzleConfirm.title',
    BODY: 'modal.deletePuzzleConfirm.message',
    FOOTER: ['modal.deletePuzzleConfirm.cancel', 'modal.deletePuzzleConfirm.confirm'],
  },
  RANKING_PUZZLE_INTRO: {
    TITLE: 'modal.rankingPuzzleIntro.title',
    BODY: 'modal.rankingPuzzleIntro.message',
    FOOTER: ['modal.rankingPuzzleIntro.cancel', 'modal.rankingPuzzleIntro.confirm'],
  },
  RANKING_PUZZLE_OUTRO: {
    TITLE: 'modal.rankingPuzzleOutro.title',
    BODY: 'modal.rankingPuzzleOutro.message',
    FOOTER: ['modal.rankingPuzzleOutro.cancel', 'modal.rankingPuzzleOutro.confirm'],
  },
  TRAINING_PACK_PURCHASE: {
    TITLE: 'modal.trainingPackPurchase.title',
    BODY: 'modal.trainingPackPurchase.message',
    FOOTER: ['modal.trainingPackPurchase.cancel', 'modal.trainingPackPurchase.confirm'],
  },
  PUZZLE_REVIEW_PURCHASE: {
    TITLE: 'modal.puzzleReviewPurchase.title',
    BODY: 'modal.puzzleReviewPurchase.message',
    FOOTER: ['modal.puzzleReviewPurchase.cancel', 'modal.puzzleReviewPurchase.confirm'],
  },
  FEATURE_IN_PROGRESS: {
    TITLE: 'modal.featureInProgress.title',
    BODY: 'modal.featureInProgress.message',
    FOOTER: 'modal.featureInProgress.confirm',
  },
};

interface CustomModalProps {
  category: ModalCategoryType | null;
  isVisible: boolean;
  onPrimaryAction: () => void;
  onSecondaryAction?: () => void;
  gameOutcome?: GameOutcome;
  bodyText?: string;
  isLoading?: boolean;
}

export const ModalCard = ({
  category,
  onPrimaryAction: onPrimaryClose,
  onSecondaryAction: onSecondaryClose = () => {},
  isLoading,
  gameOutcome,
}: Omit<CustomModalProps, 'isVisible'>) => {
  const width = useDeviceWidth();
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
        {t(bodyText, {
          rating: gameOutcome?.rating,
          reward: gameOutcome?.reward,
          price: gameOutcome?.price,
        })}
      </CustomText>
    </ModalBodyContainer>
  );

  const footer =
    typeof footerTexts === 'string' ? (
      <ModalBottomContainer>
        <CustomButton category="primary" onPress={onPrimaryClose} disabled={isLoading}>
          {t(footerTexts)}
        </CustomButton>
      </ModalBottomContainer>
    ) : (
      <ModalBottomContainer>
        <CustomButton category="secondary" onPress={onSecondaryClose} disabled={isLoading}>
          {t(footerTexts[0])}
        </CustomButton>
        <CustomButton category="primary" onPress={onPrimaryClose} disabled={isLoading}>
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
