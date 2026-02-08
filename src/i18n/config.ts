import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import en from './locales/en/translation.json';
import zh from './locales/zh/translation.json';

// Configure i18next
i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        resources: {
            en: { translation: en },
            zh: { translation: zh },
            'zh-CN': { translation: zh }, // Handle generic zh-CN
        },
        fallbackLng: 'en',
        debug: import.meta.env.DEV, // Enable debug in dev mode
        interpolation: {
            escapeValue: false, // React safe
        },
        detection: {
            order: ['localStorage', 'navigator'],
            caches: ['localStorage'],
        },
    });

export default i18n;
