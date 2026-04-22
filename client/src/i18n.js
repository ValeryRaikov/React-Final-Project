import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Import client translations
import commonEn from './locales/en/shop/common.json';
import navigationEn from './locales/en/shop/navigation.json';
import productsEn from './locales/en/shop/products.json';
import cartEn from './locales/en/shop/cart.json';
import homepageEn from './locales/en/shop/homepage.json';
import aboutEn from './locales/en/shop/about.json';
import contactEn from './locales/en/shop/contact.json';
import pagesEn from './locales/en/shop/pages.json';
import errorsEn from './locales/en/shop/errors.json';
import formsEn from './locales/en/shop/forms.json';
import othersEn from './locales/en/shop/others.json';

import commonBg from './locales/bg/shop/common.json';
import navigationBg from './locales/bg/shop/navigation.json';
import productsBg from './locales/bg/shop/products.json';
import cartBg from './locales/bg/shop/cart.json';
import homepageBg from './locales/bg/shop/homepage.json';
import aboutBg from './locales/bg/shop/about.json';
import contactBg from './locales/bg/shop/contact.json';
import pagesBg from './locales/bg/shop/pages.json';
import errorsBg from './locales/bg/shop/errors.json';
import formsBg from './locales/bg/shop/forms.json';
import othersBg from './locales/bg/shop/others.json';

const resources = {
    en: {
        translation: {
            ...commonEn,
        },
        common: commonEn,
        navigation: navigationEn,
        products: productsEn,
        cart: cartEn,
        homepage: homepageEn,
        about: aboutEn,
        contact: contactEn,
        pages: pagesEn,
        errors: errorsEn,
        forms: formsEn,
        others: othersEn,
    },
    bg: {
        translation: {
            ...commonBg,
        },
        common: commonBg,
        navigation: navigationBg,
        products: productsBg,
        cart: cartBg,
        homepage: homepageBg,
        about: aboutBg,
        contact: contactBg,
        pages: pagesBg,
        errors: errorsBg,
        forms: formsBg,
        others: othersBg,
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
