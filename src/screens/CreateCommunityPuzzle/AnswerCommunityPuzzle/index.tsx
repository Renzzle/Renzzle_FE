import React, { useEffect, useRef, useState } from 'react';
import { Container, InputWrapper, RedoButton, UndoButton, UndoRedoWrapper } from '../index.styles';
import { BottomButtonBar, CustomModal, CustomTextInput, Icon } from '../../../components/common';
import Board, { BoardRef } from '../../../components/features/Board';
import { ParamListBase, RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import useModal from '../../../hooks/useModal';
import { useTranslation } from 'react-i18next';
import { NativeModules } from 'react-native';
import { RootStackParamList } from '../../../components/types';
import { showBottomToast } from '../../../components/common/Toast/toastMessage';

const AnswerCommunityPuzzle = () => {
  const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();
  const route = useRoute<RouteProp<RootStackParamList, 'AnswerCommunityPuzzle'>>();
  const {
    isModalVisible,
    activateModal,
    closePrimarily,
    closeSecondarily,
    category: modalCategory,
  } = useModal();
  const { t } = useTranslation();
  const { SearchJNI } = NativeModules;
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);
  const problemSequence = route.params.problemSequence;
  const description = route.params.description;
  const [currentSequence, setCurrentSequence] = useState(problemSequence);
  const [isVerified, setIsVerified] = useState(false);
  const [isUploadDisabled, setIsUploadDisabled] = useState<boolean>(true);
  const [depth, setDepth] = useState<number>();

  const boardRef = useRef<BoardRef>(null);

  const handleUndo = () => {
    boardRef.current?.undo();
  };

  const handleRedo = () => {
    boardRef.current?.redo();
  };

  const handleDisabledColor = (isEnable: boolean) => {
    if (isEnable) {
      return 'gray/gray500';
    } else {
      return 'gray/gray200';
    }
  };

  const transition = [
    {
      text: '검증',
      onAction: async () => {
        await verifySequence();
      },
      disabled: false,
    },
    {
      text: '미인증 업로드',
      onAction: async () => {},
      disabled: isUploadDisabled,
    },
  ];

  const verifySequence = async () => {
    try {
      const result = await SearchJNI.findWinWrapper(currentSequence);
      console.log('VCF Wrapper Result: ', result);
    } catch (error) {
      console.error('VCF search failed: ', error);
      showBottomToast('error', '검증 중 오류가 발생했습니다.');
    }
  };

  const uploadVerifiedPuzzle = async () => {
    if (isVerified && currentSequence.length > problemSequence.length) {
    }
  };
  const uploadUnverifiedPuzzle = async () => {};

  useEffect(() => {
    if (currentSequence.length > problemSequence.length) {
      setIsUploadDisabled(false);
    } else {
      setIsUploadDisabled(true);
    }
  }, [currentSequence, problemSequence]);

  return (
    <Container>
      <InputWrapper>
        <CustomTextInput
          placeholder={t('placeholder.description')}
          value={description}
          onChangeText={() => {}}
          maxLength={100}
          disabled
        />
      </InputWrapper>

      <Board
        ref={boardRef}
        mode="make"
        makeMode="review"
        sequence={currentSequence}
        setSequence={setCurrentSequence}
        problemSequence={problemSequence}
        onUndoRedoStateChange={(undo, redo) => {
          setCanUndo(undo);
          setCanRedo(redo);
        }}
      />

      <UndoRedoWrapper>
        <UndoButton onPress={handleUndo} disabled={!canUndo}>
          <Icon name="ChevronLeftIcon" color={handleDisabledColor(canUndo)} />
        </UndoButton>
        <RedoButton onPress={handleRedo} disabled={!canRedo}>
          <Icon name="ChevronRightIcon" color={handleDisabledColor(canRedo)} />
        </RedoButton>
      </UndoRedoWrapper>

      <BottomButtonBar transitions={transition} />

      <CustomModal
        isVisible={isModalVisible}
        category={modalCategory}
        onPrimaryAction={closePrimarily}
        onSecondaryAction={closeSecondarily}
        gameOutcome={{ price: 100 }}
      />
    </Container>
  );
};

export default AnswerCommunityPuzzle;
