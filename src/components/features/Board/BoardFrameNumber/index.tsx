import React from 'react';
import { HorizontalNum, VerticalNum } from './index.styles';
import useDeviceWidth from '../../../../hooks/useDeviceWidth';
import CustomText from '../../../common/CustomText';

const BOARD_SIZE = 15;

interface BoardFrameNumberProps {
  direction: 'vertical' | 'horizontal';
}

const BoardFrameNumber = ({ direction }: BoardFrameNumberProps) => {
  const width = useDeviceWidth();
  const boardWidth = width - 20;

  const replaceWithReverseNumber = (num: number): number => {
    if (num < 0 || num > BOARD_SIZE - 1) {
      throw new Error('Input number must be between 0 and 14');
    }
    return BOARD_SIZE - num;
  };

  const replaceWithAlphabet = (num: number): string => {
    if (num < 0 || num > BOARD_SIZE - 1) {
      throw new Error('Input number must be between 0 and 14');
    }
    return String.fromCharCode(65 + num);
  };

  if (direction === 'vertical') {
    return (
      <VerticalNum boardWidth={boardWidth}>
        {Array.from({ length: BOARD_SIZE }).map((_, idx) => (
          <CustomText size={8} color="gray/gray500" key={idx}> {`${replaceWithReverseNumber(idx)}`} </CustomText>
        ))}
      </VerticalNum>
    );
  }
  if (direction === 'horizontal') {
    return (
      <HorizontalNum boardWidth={boardWidth}>
        {Array.from({ length: BOARD_SIZE }).map((_, idx) => (
          <CustomText size={8} color="gray/gray500" key={idx}> {`${replaceWithAlphabet(idx)}`} </CustomText>
        ))}
      </HorizontalNum>
    );
  }
};

export default BoardFrameNumber;
