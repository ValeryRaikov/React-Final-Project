import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Import client translations
import commonEn from './locales/en/shop/common.json';
import navigationEn from './locales/en/shop/navigation.json';
import productsEn from './locales/en/shop/products.json';
import cartEn from './locales/en/shop/cart.json';

import commonBg from './locales/bg/shop/common.json';
import navigationBg from './locales/bg/shop/navigation.json';
import productsBg from './locales/bg/shop/products.json';
import cartBg from './locales/bg/shop/cart.json';

const resources = {
    en: {
        translation: {
            ...commonEn,
        },
        common: commonEn,
        navigation: navigationEn,
        products: productsEn,
        cart: cartEn,
    },
    bg: {
        translation: {
            ...commonBg,
        },
        common: commonBg,
        navigation: navigationBg,
        products: productsBg,
        cart: cartBg,
    },
};

const savedLanguage = localStorage.getItem('shopLanguage') || 'en';

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
