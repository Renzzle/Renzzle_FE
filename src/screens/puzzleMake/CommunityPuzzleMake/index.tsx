import React, { useEffect, useState } from 'react';
import { IndicatorContainer, MakeContainer, TextInputContainer } from './index.styles';
import Board from '../../../components/features/Board';
import GameStatusIndicator from '../../../components/features/GameStatusIndicator';
import CustomTextInput from '../../../components/common/CustomTextInput';
import BottomButtonBar from '../../../components/common/BottomButtonBar';
import { uploadPuzzle } from '../../../apis/community';
import useModal from '../../../hooks/useModal';
import CustomModal from '../../../components/common/CustomModal';
import { ParamListBase, useNavigation } from '@react-navigation/native';
import { DrawerNavigationProp } from '@react-navigation/drawer';

const CommunityPuzzleMake = () => {
  const navigation = useNavigation<DrawerNavigationProp<ParamListBase>>();
  const [title, setTitle] = useState<string>('');
  const [isDisabled, setIsDisabled] = useState<boolean>(true);
  const [sequence, setSequence] = useState<string>('');
  const [isVerified, setIsVerified] = useState<boolean>(false);
  const { isModalVisible, activateModal, closePrimarily, closeSecondarily, category: modalCategory } = useModal();

  const transition = [
    {
      text: '출제',
      onAction: () => {
        console.log('Current sequence: ', sequence);
        setIsDisabled(true);
        // TODO: AI 검증 연결
        // AI가 성공하면
        activateModal('VALIDATION_COMPLETE', {
          primaryAction: () => {
            setIsVerified(true);
          },
          secondaryAction: () => {},
        });
      },
      disabled: isDisabled,
    },
  ];

  useEffect(() => {
    if (sequence !== '' && title !== '') {
      setIsDisabled(false);
    }
  }, [sequence, title]);

  useEffect(() => {
    const verifyAndUpload = async () => {
      if (isVerified) {
        console.log('title: ' + title + ', sequence: ' + sequence);
        await uploadPuzzle(title, sequence, 3, 'LOW', 'BLACK', `${process.env.ACCESS_TOKEN}`);
        navigation.navigate('CommunityPuzzleList');
      }
    };
    verifyAndUpload();
  }, [isVerified, title, sequence, navigation]);

  return (
    <MakeContainer>
      {isModalVisible && <CustomModal isVisible={isModalVisible} category={modalCategory} onPrimaryAction={closePrimarily} onSecondaryAction={closeSecondarily} />}

      <TextInputContainer>
        <CustomTextInput
          placeholder="Enter a title"
          value={title}
          onChangeText={setTitle}
        />
      </TextInputContainer>

      <IndicatorContainer>
        <GameStatusIndicator />
      </IndicatorContainer>

      <Board sequence={sequence} setSequence={setSequence} />

      <BottomButtonBar transitions={transition} />
    </MakeContainer>
  );
};

export default CommunityPuzzleMake;
