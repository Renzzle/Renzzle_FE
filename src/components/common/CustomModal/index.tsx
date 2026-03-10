import React from 'react';
import { Modal, TouchableWithoutFeedback, View } from 'react-native';
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
import { GameOutcome } from '../../../types';

export type ModalCategoryType =
  | 'TRAINING_PUZZLE_SUCCESS'
  | 'TRAINING_PACK_COMPLETE'
  | 'COMMUNITY_PUZZLE_SUCCESS'
  | 'RANKING_PUZZLE_SUCCESS'
  | 'TRAINING_PUZZLE_FAILURE'
  | 'COMMUNITY_PUZZLE_FAILURE'
  | 'VALIDATION_COMPLETE'
  | 'VALIDATION_FAILED'
  | 'PUZZLE_UPLOAD_SUCCESS'
  | 'PUZZLE_UPLOAD_FAILED'
  | 'DELETE_PUZZLE_CONFIRM'
  | 'RANKING_PUZZLE_INTRO'
  | 'RANKING_PUZZLE_OUTRO'
  | 'TRAINING_PACK_PURCHASE'
  | 'PUZZLE_REVIEW_PURCHASE'
  | 'NICKNAME_CHANGE_PURCHASE'
  | 'FEATURE_IN_PROGRESS'
  | 'NETWORK_ERROR';

const NON_DISMISSIBLE_CATEGORIES: ModalCategoryType[] = [
  'NETWORK_ERROR',
  'RANKING_PUZZLE_OUTRO',
  'TRAINING_PUZZLE_SUCCESS',
  'COMMUNITY_PUZZLE_SUCCESS',
  'RANKING_PUZZLE_SUCCESS',
  'TRAINING_PUZZLE_FAILURE',
  'COMMUNITY_PUZZLE_FAILURE',
];

export const MODAL_TEXTS = {
  TRAINING_PUZZLE_SUCCESS: {
    TITLE: 'modal.trainingPuzzleSuccess.title',
    BODY: 'modal.trainingPuzzleSuccess.message',
    FOOTER: ['modal.trainingPuzzleSuccess.cancel', 'modal.trainingPuzzleSuccess.confirm'],
  },
  TRAINING_PACK_COMPLETE: {
    TITLE: 'modal.trainingPuzzleSuccess.title',
    BODY: 'modal.trainingPuzzleSuccess.message',
    FOOTER: 'modal.trainingPuzzleSuccess.cancel',
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
  TRAINING_PUZZLE_FAILURE: {
    TITLE: 'modal.trainingPuzzleFailure.title',
    BODY: 'modal.trainingPuzzleFailure.message',
    FOOTER: ['modal.trainingPuzzleFailure.cancel', 'modal.trainingPuzzleFailure.confirm'],
  },
  COMMUNITY_PUZZLE_FAILURE: {
    TITLE: 'modal.communityPuzzleFailure.title',
    BODY: 'modal.communityPuzzleFailure.message',
    FOOTER: ['modal.communityPuzzleFailure.cancel', 'modal.communityPuzzleFailure.confirm'],
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
  NICKNAME_CHANGE_PURCHASE: {
    TITLE: 'modal.nicknameChangePurchase.title',
    BODY: 'modal.nicknameChangePurchase.message',
    FOOTER: ['modal.nicknameChangePurchase.cancel', 'modal.nicknameChangePurchase.confirm'],
  },
  FEATURE_IN_PROGRESS: {
    TITLE: 'modal.featureInProgress.title',
    BODY: 'modal.featureInProgress.message',
    FOOTER: 'modal.featureInProgress.confirm',
  },
  NETWORK_ERROR: {
    TITLE: 'modal.networkError.title',
    BODY: 'modal.networkError.message',
    FOOTER: 'modal.networkError.confirm',
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
  children?: React.ReactNode;
}

export const ModalCard = ({
  category,
  onPrimaryAction: onPrimaryClose,
  onSecondaryAction: onSecondaryClose = () => {},
  isLoading,
  gameOutcome,
  children,
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
    </ModalTopContainer>
  );

  const body = (
    <ModalBodyContainer>
      <CustomText size={14} lineHeight="lg" color="gray/gray600">
        {t(bodyText, {
          rating: gameOutcome?.rating,
          reward: gameOutcome?.reward,
          price: gameOutcome?.price,
          puzzleCount: gameOutcome?.puzzleCount,
        })}
        {children}
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
    <ModalContainer screenWidth={width}>
      {title}
      {body}
      {footer}
    </ModalContainer>
  );
};

const CustomModal = ({
  isVisible,
  onPrimaryAction,
  onSecondaryAction,
  category,
  children,
  ...props
}: CustomModalProps) => {
  const handleDismiss = () => {
    if (category && NON_DISMISSIBLE_CATEGORIES.includes(category)) {
      return;
    }

    if (onSecondaryAction) {
      onSecondaryAction();
    } else {
      onPrimaryAction();
    }
  };

  return (
    <Modal
      visible={isVisible}
      transparent={true}
      animationType="fade"
      onRequestClose={handleDismiss}>
      {isVisible && (
        <CenteredView onPress={handleDismiss}>
          <TouchableWithoutFeedback onPress={(e) => e.stopPropagation()}>
            <View>
              <ModalCard
                category={category}
                onPrimaryAction={onPrimaryAction}
                onSecondaryAction={onSecondaryAction}
                {...props}>
                {children}
              </ModalCard>
            </View>
          </TouchableWithoutFeedback>
        </CenteredView>
      )}
    </Modal>
  );
};

export default CustomModal;
