import React, { useEffect, useMemo, useRef, useState } from 'react';
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
import { getSequenceDepth } from '../../../utils/utils';
import { uploadPuzzle } from '../../../apis/community';

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
  const [answerSequence, setAnswerSequence] = useState('');
  const [isVerified, setIsVerified] = useState(false);
  const [isVerifyDisabled, setIsVerifyDisabled] = useState<boolean>(false);
  const [isUploadDisabled, setIsUploadDisabled] = useState<boolean>(true);
  const [depth, setDepth] = useState<number>(0);

  const winColor = useMemo(() => {
    const problemDepth = getSequenceDepth(problemSequence);
    return problemDepth % 2 === 0 ? 'BLACK' : 'WHITE';
  }, [problemSequence]);

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
      disabled: isVerifyDisabled,
    },
    {
      text: isVerified ? '인증 업로드' : '미인증 업로드',
      onAction: async () => {
        await handleUpload();
      },
      disabled: isUploadDisabled,
    },
  ];

  const verifySequence = async () => {
    setIsVerifyDisabled(true);
    setIsUploadDisabled(true);
    try {
      const result = await SearchJNI.findWinWrapper(problemSequence);
      console.log('VCF Wrapper Result: ', result);

      if (result.length === 0) {
        // Verification Failed
        activateModal('VALIDATION_FAILED', {
          primaryAction: () => {},
        });
        return;
      }
      // Verification Succeeded
      handleVerificationSuccess(result);

      activateModal('VALIDATION_COMPLETE', {
        primaryAction: () => {},
      });
    } catch (error) {
      console.error('VCF search failed: ', error);
      showBottomToast('error', '검증 중 오류가 발생했습니다.');
    } finally {
      setIsVerifyDisabled(false);
      setIsUploadDisabled(false);
    }
  };

  const handleVerificationSuccess = (result: string) => {
    console.log('Verification successful with sequence: ' + result);
    setCurrentSequence(problemSequence + result);
    setAnswerSequence(result);
    setDepth(getSequenceDepth(result));
    setIsVerified(true);
  };

  const handleUpload = async () => {
    if (answerSequence.length > 0 && depth > 0 && winColor !== null) {
      setIsVerifyDisabled(true);
      setIsUploadDisabled(true);
      try {
        const data = await uploadPuzzle(
          problemSequence,
          answerSequence,
          depth,
          description,
          winColor,
          isVerified,
        );

        if (data.isSuccess) {
          activateModal('PUZZLE_UPLOAD_SUCCESS', {
            primaryAction: () => {
              navigation.navigate('CommunityPuzzles');
            },
          });
        }
      } catch (error) {
        console.error('Puzzle Upload Error:', error);
        showBottomToast('error', error as string);
      } finally {
        setIsVerifyDisabled(false);
        setIsUploadDisabled(false);
      }
    } else {
      activateModal('PUZZLE_UPLOAD_FAILED', {
        primaryAction: () => {
          navigation.goBack();
        },
      });
    }
  };

  const handleSequenceChangeByUser = (newSequence: string) => {
    setCurrentSequence(newSequence);
    const slicedAnswer = newSequence.slice(problemSequence.length);
    setAnswerSequence(slicedAnswer);
    setDepth(getSequenceDepth(slicedAnswer));
    setIsVerified(false); // 사용자가 수정했으므로 미인증 처리
  };

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
        setSequence={handleSequenceChangeByUser}
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
