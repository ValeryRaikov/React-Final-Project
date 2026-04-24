import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Import admin translations
import commonEn from './locales/en/admin/common.json';
import navigationEn from './locales/en/admin/navigation.json';
import adminsEn from './locales/en/admin/admins.json';
import productsEn from './locales/en/admin/products.json';
import authEn from './locales/en/admin/auth.json';
import promocodesEn from './locales/en/admin/promocodes.json';
import othersEn from './locales/en/admin/others.json';
import statisticsEN from './locales/en/admin/statistics.json';

import commonBg from './locales/bg/admin/common.json';
import navigationBg from './locales/bg/admin/navigation.json';
import adminsBg from './locales/bg/admin/admins.json';
import productsBg from './locales/bg/admin/products.json';
import authBg from './locales/bg/admin/auth.json';
import promocodesBg from './locales/bg/admin/promocodes.json';
import othersBg from './locales/bg/admin/others.json';
import statisticsBG from './locales/bg/admin/statistics.json';

const resources = {
    en: {
        translation: {
            ...commonEn,
            ...statisticsEN,
        },
        common: commonEn,
        navigation: navigationEn,
        admins: adminsEn,
        products: productsEn,
        auth: authEn,
        promocodes: promocodesEn,
        others: othersEn,
        statistics: statisticsEN,
    },
    bg: {
        translation: {
            ...commonBg,
            ...statisticsBG,
        },
        common: commonBg,
        navigation: navigationBg,
        admins: adminsBg,
        products: productsBg,
        auth: authBg,
        promocodes: promocodesBg,
        others: othersBg,
        statistics: statisticsBG,
    },
};

const savedLanguage = localStorage.getItem('adminLanguage') || 'en';

i18n
    .use(initReactI18next)
    .init({
        resources,
        lng: savedLanguage,
        fallbackLng: 'en',
        interpolation: {
            escapeValue: false,
        },
    });

export default i18n;
