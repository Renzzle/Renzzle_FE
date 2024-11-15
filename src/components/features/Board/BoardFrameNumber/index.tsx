import React from 'react';
import { HorizontalNum, VerticalNum } from './index.styles';
import useDeviceWidth from '../../../../hooks/useDeviceWidth';
import CustomText from '../../../common/CustomText';
import { BOARD_SIZE, convertToReverseNumber, convertToUppercaseAlphabet } from '../../../../utils/utils';

interface BoardFrameNumberProps {
  direction: 'vertical' | 'horizontal';
}

const BoardFrameNumber = ({ direction }: BoardFrameNumberProps) => {
  const width = useDeviceWidth();
  const boardWidth = width - 20;

  if (direction === 'vertical') {
    return (
      <VerticalNum boardWidth={boardWidth}>
        {Array.from({ length: BOARD_SIZE }).map((_, idx) => (
          <CustomText size={8} color="gray/gray500" key={idx}> {`${convertToReverseNumber(idx)}`} </CustomText>
        ))}
      </VerticalNum>
    );
  }
  if (direction === 'horizontal') {
    return (
      <HorizontalNum boardWidth={boardWidth}>
        {Array.from({ length: BOARD_SIZE }).map((_, idx) => (
          <CustomText size={8} color="gray/gray500" key={idx}> {`${convertToUppercaseAlphabet(idx)}`} </CustomText>
        ))}
      </HorizontalNum>
    );
  }
};

export default BoardFrameNumber;
