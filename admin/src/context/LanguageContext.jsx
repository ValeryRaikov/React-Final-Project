// context/LanguageContext.jsx - Provides a context for managing the current language of the admin panel and a function to change it. 

import { createContext, useContext } from 'react';
import { useTranslation } from 'react-i18next';

// Create a context for language management
export const LanguageContext = createContext();

// LanguageProvider component to wrap the app and provide language state and functions
export const LanguageProvider = ({ children }) => {
    const { i18n } = useTranslation();

    // Function to change the current language and persist it in localStorage
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

// Custom hook to use the LanguageContext
export const useLanguage = () => {
    const context = useContext(LanguageContext);
    
    if (!context) {
        throw new Error('useLanguage must be used within LanguageProvider');
    }

    return context;
};
