import React, { useState } from 'react';
import { IndicatorContainer, MakeContainer, TextInputContainer } from './index.styles';
import Board from '../../../components/features/Board';
import GameStatusIndicator from '../../../components/features/GameStatusIndicator';
import CustomTextInput from '../../../components/common/CustomTextInput';

const CommunityPuzzleMake = () => {
  const [title, setTitle] = useState<string>('');

  return (
    <MakeContainer>
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

      <Board />
    </MakeContainer>
  );
};

export default CommunityPuzzleMake;
