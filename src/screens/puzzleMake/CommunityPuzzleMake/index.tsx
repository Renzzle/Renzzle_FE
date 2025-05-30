/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { MakeContainer, TextInputContainer } from './index.styles';
import Board from '../../../components/features/Board';
import CustomTextInput from '../../../components/common/CustomTextInput';
import BottomButtonBar from '../../../components/common/BottomButtonBar';
import { uploadPuzzle } from '../../../apis/community';
import useModal from '../../../hooks/useModal';
import CustomModal from '../../../components/common/CustomModal';
import { ParamListBase, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { NativeModules } from 'react-native';
import useAuthStore from '../../../store/useAuthStore';

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
  const {
    isModalVisible,
    activateModal,
    closePrimarily,
    closeSecondarily,
    category: modalCategory,
  } = useModal();
  const { accessToken } = useAuthStore();

  const { VCFSearchJNI } = NativeModules;
  const [depth, setDepth] = useState<number>();

  const verifySequence = async () => {
    try {
      const result = await VCFSearchJNI.findVCFWrapper(sequence);
      console.log('VCF Wrapper Result: ', result);
      setDepth(result);
    } catch (error) {
      console.error('VCF search failed: ', error);
    }
  };

  const transition = [
    {
      text: '출제',
      onAction: async () => {
        setDepth(undefined);
        console.log('Current sequence: ', sequence);
        setIsDisabled(true);

        await verifySequence();
      },
      disabled: isDisabled,
    },
  ];

  useEffect(() => {
    console.log('sequence: ', sequence, 'title', title);
    setIsDisabled(sequence === '' || title === '');
  }, [sequence, title]);

  useEffect(() => {
    if (depth !== undefined) {
      if (depth === -1) {
        // 검증 실패
        activateModal('VALIDATION_FAILED', {
          primaryAction: () => {
            setIsDisabled(false);
          },
        });
        setIsDisabled(false);
        return;
      } else {
        // 검증 성공
        activateModal('VALIDATION_COMPLETE', {
          primaryAction: () => {
            console.log('Depth!!: ' + depth);
            setIsVerified(true);
          },
          secondaryAction: () => {
            setIsDisabled(false);
          },
        });
      }
    }
  }, [depth]);

  useEffect(() => {
    const verifyAndUpload = async () => {
      if (isVerified && depth !== undefined) {
        console.log('title: ' + title + ', sequence: ' + sequence);
        if (accessToken !== undefined) {
          await uploadPuzzle(accessToken, title, sequence, depth, 'LOW', 'BLACK');
        }
        navigation.navigate('CommunityPuzzleList');
      }
    };
    verifyAndUpload();
  }, [isVerified, title, sequence, navigation, depth]);

  return (
    <MakeContainer>
      <CustomModal
        isVisible={isModalVisible}
        category={modalCategory}
        onPrimaryAction={closePrimarily}
        onSecondaryAction={closeSecondarily}
      />

      <TextInputContainer>
        <CustomTextInput placeholder="Enter a title" value={title} onChangeText={setTitle} />
      </TextInputContainer>

      <Board mode="make" sequence={sequence} setSequence={setSequence} />

      <BottomButtonBar transitions={transition} />
    </MakeContainer>
  );
};

export default CommunityPuzzleMake;
