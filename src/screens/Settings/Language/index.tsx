import React from 'react';
import { Container, ListWrapper } from '../index.styles';
import CustomListItem from '../../../components/common/CustomListItem';
import CustomRadioButton from '../../../components/common/CustomRadioButton/CustomCheckbox';
import { useTranslation } from 'react-i18next';
import { changeLanguage } from '../../../locales/i18n';
import { showBottomToast } from '../../../components/common/Toast/toastMessage';

const LANGUAGE_OPTIONS = [
  { label: '한국어', value: 'ko' },
  { label: 'English', value: 'en' },
] as const;

const Language = () => {
  const { i18n, t } = useTranslation();

  const handleSelect = async (lang: string) => {
    if (i18n.language === lang) {
      return;
    }
    await changeLanguage(lang);
    showBottomToast('success', t('toast.languageChanged'));
  };

  return (
    <Container>
      <ListWrapper>
        {LANGUAGE_OPTIONS.map((option) => (
          <CustomListItem key={option.value} onPress={() => handleSelect(option.value)}>
            <CustomRadioButton
              label={option.label}
              value={option.value}
              selectedValue={i18n.language}
              onSelect={() => handleSelect(option.value)}
            />
          </CustomListItem>
        ))}
      </ListWrapper>
    </Container>
  );
};

export default Language;
