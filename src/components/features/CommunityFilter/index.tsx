import React from 'react';
import { Container, InputsWrapper, InputWrapper } from './index.styles';
import { CustomText, DividerThin } from '../../common';
import CustomRadioButton from '../../common/CustomRadioButton/CustomCheckbox';
import CustomCheckbox from '../../common/CustomCheckbox';

export interface FilterState {
  sort: 'LATEST' | 'LIKE';
  stone: { black: boolean; white: boolean };
  auth: { verified: boolean; unverified: boolean };
  depthRange: [number, number];
  solveStatus: { solved: boolean; unsolved: boolean };
}

interface CommunityFilterProps {
  filter: FilterState;
  onChangeFilter: (updated: Partial<FilterState>) => void;
}

const SORT_OPTIONS = [
  { label: '최신순', value: 'LATEST' },
  { label: '인기순', value: 'LIKE' },
] as const;

const CommunityFilter = ({ filter, onChangeFilter }: CommunityFilterProps) => {
  const { sort, stone, auth, depthRange, solveStatus } = filter;

  return (
    <Container>
      <CustomText size={14} weight="bold" lineHeight="sm" color="gray/gray500">
        정렬
      </CustomText>
      <InputsWrapper>
        {SORT_OPTIONS.map((option) => (
          <InputWrapper key={option.value}>
            <CustomRadioButton
              label={option.label}
              value={option.value}
              selectedValue={sort}
              onSelect={() => onChangeFilter({ sort: option.value })}
            />
          </InputWrapper>
        ))}
      </InputsWrapper>

      <DividerThin />

      <CustomText size={14} weight="bold" lineHeight="sm" color="gray/gray500">
        승리
      </CustomText>
      <InputsWrapper>
        <InputWrapper>
          <CustomCheckbox
            label="흑선승"
            isChecked={stone.black}
            onToggle={() => onChangeFilter({ stone: { ...stone, black: !stone.black } })}
          />
        </InputWrapper>
        <InputWrapper>
          <CustomCheckbox
            label="백선승"
            isChecked={stone.white}
            onToggle={() => onChangeFilter({ stone: { ...stone, white: !stone.white } })}
          />
        </InputWrapper>
      </InputsWrapper>

      <DividerThin />

      <CustomText size={14} weight="bold" lineHeight="sm" color="gray/gray500">
        인증여부
      </CustomText>
      <InputsWrapper>
        <InputWrapper>
          <CustomCheckbox
            label="인증"
            isChecked={auth.verified}
            onToggle={() => onChangeFilter({ auth: { ...auth, verified: !auth.verified } })}
          />
        </InputWrapper>
        <InputWrapper>
          <CustomCheckbox
            label="미인증"
            isChecked={auth.unverified}
            onToggle={() => onChangeFilter({ auth: { ...auth, unverified: !auth.unverified } })}
          />
        </InputWrapper>
      </InputsWrapper>

      <DividerThin />

      <CustomText size={14} weight="bold" lineHeight="sm" color="gray/gray500">
        깊이
      </CustomText>

      <DividerThin />

      <CustomText size={14} weight="bold" lineHeight="sm" color="gray/gray500">
        풀이여부
      </CustomText>
      <InputsWrapper>
        <InputWrapper>
          <CustomCheckbox
            label="풀이 완료"
            isChecked={solveStatus.solved}
            onToggle={() =>
              onChangeFilter({ solveStatus: { ...solveStatus, solved: !solveStatus.solved } })
            }
          />
        </InputWrapper>
        <InputWrapper>
          <CustomCheckbox
            label="풀이 전"
            isChecked={solveStatus.unsolved}
            onToggle={() =>
              onChangeFilter({ solveStatus: { ...solveStatus, unsolved: !solveStatus.unsolved } })
            }
          />
        </InputWrapper>
      </InputsWrapper>
    </Container>
  );
};

export default CommunityFilter;
