import React, { useEffect, useRef, useState } from 'react';
import {
  BoardHeaderWrapper,
  Container,
  InputWrapper,
  RedoButton,
  UndoButton,
  UndoRedoWrapper,
} from './index.styles';
import Board, { BoardRef } from '../../components/features/Board';
import { BottomButtonBar, CustomTextInput, Icon } from '../../components/common';
import { ParamListBase, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import HelperText from '../../components/common/HelperText';

const CreateCommunityPuzzle = () => {
  const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();
  const { t } = useTranslation();
  const [description, setDescription] = useState<string>('');
  const [currentSequence, setCurrentSequence] = useState(''); // 현재 시퀀스
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);
  const [isTransitionDisabled, setIsTransitionDisabled] = useState(true);

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
      text: '정답 입력',
      onAction: () =>
        navigation.navigate('AnswerCommunityPuzzle', {
          problemSequence: currentSequence,
          description: description,
        }),
      disabled: isTransitionDisabled,
    },
  ];

  useEffect(() => {
    if (currentSequence.length !== 0) {
      setIsTransitionDisabled(false);
    } else {
      setIsTransitionDisabled(true);
    }
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

      <BoardHeaderWrapper>
        <HelperText type="info">{t('puzzle.createDescription')}</HelperText>
      </BoardHeaderWrapper>

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
    </Container>
  );
};

export default CreateCommunityPuzzle;
