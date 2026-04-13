import { createContext, useContext } from 'react';
import { useTranslation } from 'react-i18next';

export const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
    const { i18n } = useTranslation();

    const changeLanguage = (language) => {
        i18n.changeLanguage(language);
        localStorage.setItem('adminLanguage', language);
    };

    const value = {
        currentLanguage: i18n.language,
        changeLanguage,
        isEnglish: i18n.language === 'en',
        isBulgarian: i18n.language === 'bg',
    };

    return (
        <LanguageContext.Provider value={value}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useLanguage = () => {
    const context = useContext(LanguageContext);
    if (!context) {
        throw new Error('useLanguage must be used within LanguageProvider');
    }
    return context;
};
