// context/LanguageContext.jsx - Provides language state and functions to the app using React Context API

import { createContext, useContext } from 'react';
import { useTranslation } from 'react-i18next';

// Create a context for language management
export const LanguageContext = createContext();

// LanguageProvider component to wrap the app and provide language state and functions
export const LanguageProvider = ({ children }) => {
    const { i18n } = useTranslation();

    // Function to change the language and store the preference in localStorage
    const changeLanguage = (language) => {
        i18n.changeLanguage(language);
        localStorage.setItem('shopLanguage', language);
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

// Custom hook to use the LanguageContext
export const useLanguage = () => {
    const context = useContext(LanguageContext);

    if (!context) {
        throw new Error('useLanguage must be used within LanguageProvider');
    }

    return context;
};
