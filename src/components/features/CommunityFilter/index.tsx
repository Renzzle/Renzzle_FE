import React, { useState } from 'react';
import {
  Container,
  InputsWrapper,
  InputWrapper,
  markerStyle,
  selectedStyle,
  SliderWrapper,
  unselectedStyle,
} from './index.styles';
import { CustomText, DividerThin } from '../../common';
import CustomRadioButton from '../../common/CustomRadioButton/CustomCheckbox';
import CustomCheckbox from '../../common/CustomCheckbox';
import MultiSlider from '@ptomasroos/react-native-multi-slider';
import { useTranslation } from 'react-i18next';
import { DEPTH } from '../../../types';

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

const CommunityFilter = ({ filter, onChangeFilter }: CommunityFilterProps) => {
  const { t } = useTranslation();
  const { sort, stone, auth, depthRange, solveStatus } = filter;

  const SORT_OPTIONS = [
    { label: t('modal.filter.subtitle.sort.options.0'), value: 'LATEST' },
    { label: t('modal.filter.subtitle.sort.options.1'), value: 'LIKE' },
  ] as const;

  const [depthValues, setDepthValues] = useState(depthRange);
  const [sliderWidth, setSliderWidth] = useState(0);

  return (
    <Container>
      <CustomText size={14} weight="bold" lineHeight="sm" color="gray/gray500">
        {t('modal.filter.subtitle.sort.title')}
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
        {t('modal.filter.subtitle.win')}
      </CustomText>
      <InputsWrapper>
        <InputWrapper>
          <CustomCheckbox
            label={t('puzzle.blackWin')}
            isChecked={stone.black}
            onToggle={() => onChangeFilter({ stone: { ...stone, black: !stone.black } })}
          />
        </InputWrapper>
        <InputWrapper>
          <CustomCheckbox
            label={t('puzzle.whiteWin')}
            isChecked={stone.white}
            onToggle={() => onChangeFilter({ stone: { ...stone, white: !stone.white } })}
          />
        </InputWrapper>
      </InputsWrapper>

      <DividerThin />

      <CustomText size={14} weight="bold" lineHeight="sm" color="gray/gray500">
        {t('modal.filter.subtitle.certification')}
      </CustomText>
      <InputsWrapper>
        <InputWrapper>
          <CustomCheckbox
            label={t('puzzle.certified')}
            isChecked={auth.verified}
            onToggle={() => onChangeFilter({ auth: { ...auth, verified: !auth.verified } })}
          />
        </InputWrapper>
        <InputWrapper>
          <CustomCheckbox
            label={t('puzzle.notCertified')}
            isChecked={auth.unverified}
            onToggle={() => onChangeFilter({ auth: { ...auth, unverified: !auth.unverified } })}
          />
        </InputWrapper>
      </InputsWrapper>

      <DividerThin />

      <CustomText size={14} weight="bold" lineHeight="sm" color="gray/gray500">
        {t('puzzle.depth')}
      </CustomText>
      <CustomText size={14} lineHeight="sm" color="gray/gray500">
        {depthValues[0]}-{depthValues[1]}
        {depthValues[1] === DEPTH.SEARCH_MAX && '+'}
      </CustomText>
      <SliderWrapper onLayout={(e) => setSliderWidth(e.nativeEvent.layout.width)}>
        <MultiSlider
          values={depthValues}
          min={DEPTH.MIN}
          max={DEPTH.SEARCH_MAX}
          step={2}
          sliderLength={sliderWidth}
          selectedStyle={selectedStyle}
          unselectedStyle={unselectedStyle}
          markerStyle={markerStyle}
          onValuesChange={(val) => setDepthValues([val[0], val[1]])}
          onValuesChangeFinish={(val) => {
            setDepthValues([val[0], val[1]]);
            onChangeFilter({ depthRange: [val[0], val[1]] });
          }}
        />
      </SliderWrapper>

      <DividerThin />

      <CustomText size={14} weight="bold" lineHeight="sm" color="gray/gray500">
        {t('modal.filter.subtitle.solvedStatus')}
      </CustomText>
      <InputsWrapper>
        <InputWrapper>
          <CustomCheckbox
            label={t('puzzle.solved')}
            isChecked={solveStatus.solved}
            onToggle={() =>
              onChangeFilter({ solveStatus: { ...solveStatus, solved: !solveStatus.solved } })
            }
          />
        </InputWrapper>
        <InputWrapper>
          <CustomCheckbox
            label={t('puzzle.unsolved')}
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
