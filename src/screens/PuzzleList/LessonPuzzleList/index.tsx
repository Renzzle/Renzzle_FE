import React from 'react';
import { CardsContainer } from './index.styles';
import PuzzleListCard from '../../../components/features/PuzzleListCard';
import CustomText from '../../../components/common/CustomText';

const LessonPuzzleList = () => {
  return (
    <CardsContainer>
      <PuzzleListCard
        title="금수란 무엇일까? 1"
        author="Renzzle"
        description="깊이 3 | 난이도 하 | 흑선승"
        bottom={() => (
          <CustomText
            size={10}
            lineHeight="sm"
            color="gray/gray500"
          >
            금수가 무엇인지 알아봅시다 - 장목
          </CustomText>
        )}
        isLocked={false}
      />
      <PuzzleListCard
        title="금수란 무엇일까? 2"
        author="Renzzle"
        description="깊이 3 | 난이도 하 | 흑선승"
        bottom={() => (
          <CustomText
            size={10}
            lineHeight="sm"
            color="gray/gray500"
          >
            금수가 무엇인지 알아봅시다 - 삼삼
          </CustomText>
        )}
        isLocked={true}
      />
    </CardsContainer>
  );
};

export default LessonPuzzleList;
