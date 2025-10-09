/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef, useState } from 'react';
import { Container, InputWrapper, RedoButton, UndoButton, UndoRedoWrapper } from './index.styles';
import Board, { BoardRef } from '../../components/features/Board';
import { BottomButtonBar, CustomModal, CustomTextInput, Icon } from '../../components/common';
import useModal from '../../hooks/useModal';
import { ParamListBase, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import { NativeModules } from 'react-native';
import { showBottomToast } from '../../components/common/Toast/toastMessage';

const CreateCommunityPuzzle = () => {
  const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();
  const {
    isModalVisible,
    activateModal,
    closePrimarily,
    closeSecondarily,
    category: modalCategory,
  } = useModal();
  const { t } = useTranslation();
  const { VCFSearchJNI } = NativeModules;
  const [description, setDescription] = useState<string>('');
  const [isVerifyDisabled, setIsVerifyDisabled] = useState<boolean>(true);
  const [isUploadDisabled, setIsUploadDisabled] = useState<boolean>(true);
  const [isVerified, setIsVerified] = useState<boolean>(false); // 검증 성공 여부
  const [depth, setDepth] = useState<number>();
  const [currentSequence, setCurrentSequence] = useState(''); // 현재 시퀀스
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);
  const [isVerifyFailed, setIsVerifyFailed] = useState(false); // 검증 실패 여부

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

  // const transition = [
  //   {
  //     text: '검증',
  //     onAction: async () => {
  //       setDepth(undefined);
  //       setIsVerifyDisabled(true);

  //       // TODO: ai 검증로직
  //       await verifySequence();
  //     },
  //     disabled: isVerifyDisabled,
  //   },
  //   {
  //     text: '업로드',
  //     onAction: async () => {
  //       if (isVerifyFailed) {
  //         await uploadUnverifiedPuzzle();
  //       } else {
  //         await uploadVerifiedPuzzle();
  //       }
  //     },
  //     disabled: isUploadDisabled,
  //   },
  // ];
  const transition = [
    {
      text: '정답 입력',
      onAction: () =>
        navigation.navigate('AnswerCommunityPuzzle', {
          problemSequence: currentSequence,
          description: description,
        }),
    },
  ];

  const verifySequence = async () => {
    try {
      const result = await VCFSearchJNI.findVCFWrapper(currentSequence);
      console.log('VCF Wrapper Result: ', result);
      setDepth(result);
    } catch (error) {
      console.error('VCF search failed: ', error);
      showBottomToast('error', '검증 중 오류가 발생했습니다.');
    }
  };

  const uploadVerifiedPuzzle = async () => {
    if (isVerified && depth !== undefined && depth > -1) {
      console.log('Submitting Puzzle...');
      console.log('Description:', description);
      console.log('Sequence:', currentSequence);
      console.log('Depth:', depth);

      // await uploadPuzzle(boardStatus, answer, depth, description, winColor, isVerified);

      navigation.goBack(); // Or navigate to the puzzle list screen
    }
  };

  const uploadUnverifiedPuzzle = async () => {
    if (!isVerified && isVerifyFailed) {
      // await uploadPuzzle();
      navigation.goBack();
    }
  };

  useEffect(() => {
    if (currentSequence.length > 0) {
      setIsVerifyDisabled(false);
    } else {
      setIsVerifyDisabled(true);
    }
  }, [description, currentSequence]);

  useEffect(() => {
    if (depth !== undefined) {
      console.log('depth changed:', depth);

      if (depth === -1) {
        // Verification Failed
        activateModal('VALIDATION_FAILED', {
          primaryAction: () => {
            setIsVerifyDisabled(false);
            setIsVerified(false);
            setIsVerifyFailed(true);
            setIsUploadDisabled(true);
          },
        });
      } else {
        // Verification Succeeded
        activateModal('VALIDATION_COMPLETE', {
          primaryAction: () => {
            console.log('Verification successful with depth: ' + depth);
            setIsVerifyDisabled(false);
            setIsVerified(true);
            setIsVerifyFailed(false);
            setIsUploadDisabled(false);
          },
        });
      }
    }
  }, [depth]);

  useEffect(() => {
    setIsVerifyFailed(false);
  }, [currentSequence]);

  return (
    <Container>
      <InputWrapper>
        <CustomTextInput
          placeholder={t('placeholder.description')}
          value={description}
          onChangeText={setDescription}
          maxLength={100}
        />
      </InputWrapper>

      <Board
        ref={boardRef}
        mode="make"
        makeMode="create"
        sequence={currentSequence}
        setSequence={setCurrentSequence}
        problemSequence=""
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

export default CreateCommunityPuzzle;
