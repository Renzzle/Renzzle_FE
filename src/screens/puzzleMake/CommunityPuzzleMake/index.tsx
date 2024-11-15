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
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { NativeModules } from 'react-native';

declare module 'react-native' {
  interface NativeModulesStatic {
    VCFSearchJNI: {
      findVCFWrapper: (sequence: string) => Promise<number>;
    };
  }
}

const CommunityPuzzleMake = () => {
  const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();
  const [title, setTitle] = useState<string>('');
  const [isDisabled, setIsDisabled] = useState<boolean>(true);
  const [sequence, setSequence] = useState<string>('');
  const [isVerified, setIsVerified] = useState<boolean>(false);
  const { isModalVisible, activateModal, closePrimarily, closeSecondarily, category: modalCategory } = useModal();

  const { VCFSearchJNI } = NativeModules;
  const [depth, setDepth] = useState<number>(-1);

  const verifySequence = async () => {
    console.log('start');
    try {
      console.log('검증시작');
      const result = await VCFSearchJNI.findVCFWrapper(sequence);
      console.log('검증끝');
      console.log('VCF Wrapper Result: ', result);
      console.log('Depth: ' + depth);
      setDepth(result);
    } catch (error) {
      console.error('VCF search failed: ', error);
    }
  };

  const transition = [
    {
      text: '출제',
      onAction: async () => {
        console.log('Current sequence: ', sequence);
        setIsDisabled(true);

        // const verifySequence = async () => {
        //   try {
        //     const result = await VCFSearchJNI.findVCFWrapper(sequence);
        //     console.log('Depth: ' + depth);
        //     setDepth(result);
        //   } catch (error) {
        //     console.error('VCF search failed: ', error);
        //   }
        // };
        await verifySequence();

        if (depth === -1) { // 검증 실패
          activateModal('VALIDATION_FAILED', {
            primaryAction: () => {},
          });
          setIsDisabled(false);
          return;
        }

        // 검증 성공
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
    console.log('sequence: ', sequence, 'title', title);
    setIsDisabled(sequence === '' || title === '');
  }, [sequence, title]);

  useEffect(() => {
    const verifyAndUpload = async () => {
      if (isVerified) {
        console.log('title: ' + title + ', sequence: ' + sequence);
        await uploadPuzzle(title, sequence, depth, 'LOW', 'BLACK', `${process.env.ACCESS_TOKEN}`);
        navigation.navigate('CommunityPuzzleList');
      }
    };
    verifyAndUpload();
  }, [isVerified, title, sequence, navigation, depth]);

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

      <Board mode="make" sequence={sequence} setSequence={setSequence} />

      <BottomButtonBar transitions={transition} />
    </MakeContainer>
  );
};

export default CommunityPuzzleMake;
