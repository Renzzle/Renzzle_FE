import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as Localization from 'react-native-localize';
import en from './en.json';
import ko from './ko.json';
import EncryptedStorage from 'react-native-encrypted-storage';

const LANGUAGE_STORAGE_KEY = 'language';

const resources = {
  en: { translation: en },
  ko: { translation: ko },
};

const getLanguage = async () => {
  const saved = await EncryptedStorage.getItem(LANGUAGE_STORAGE_KEY);
  if (saved) {
    return saved;
  }

  const deviceLang = Localization.getLocales()[0]?.languageCode ?? 'en';

  const supported = ['ko', 'en'];
  return supported.includes(deviceLang) ? deviceLang : 'en';
};

export const initI18n = async () => {
  const language = await getLanguage();

  await i18n.use(initReactI18next).init({
    resources,
    lng: language,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
  });
};

export const changeLanguage = async (lang: string) => {
  if (i18n.language === lang) {
    return;
  }

  await EncryptedStorage.setItem(LANGUAGE_STORAGE_KEY, lang);
  await i18n.changeLanguage(lang);
};

export default i18n;
