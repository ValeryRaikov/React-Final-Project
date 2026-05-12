// context/AuthContext.jsx - Provides authentication state and functions to the app using React Context API

import { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

import WarningModal from "../components/warning-modal/WarningModal";

// Create the AuthContext with default value of null
export const AuthContext = createContext(null);

// AuthContextProvider component to wrap around the app and provide authentication state and functions
export default function AuthContextProvider(props) {
    const navigate = useNavigate();
    const { t } = useTranslation(['errors', 'forms']);
    const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('auth-token'));
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [modalContent, setModalContent] = useState({ title: '', children: null });

    // Check authentication status on component mount and whenever the auth token changes
    useEffect(() => {
        setIsAuthenticated(!!localStorage.getItem('auth-token'));
    }, []);

    // Login function to set authentication state to true and hide any modals
    const handleLogin = () => {
        setIsAuthenticated(true);
        setIsModalVisible(false);
    }
    
    // Logout function to clear auth token and update authentication state
    const handleLogout = () => {
        setIsAuthenticated(false);
    }

    // Function to handle session expiration by clearing auth token, updating state, and showing a modal
    const handleSessionExpired = () => {
        // Clear auth token
        localStorage.removeItem('auth-token');
        // Set authenticated to false
        setIsAuthenticated(false);
        // Show session expired modal
        showModal(t('errors:sessionExpiredTitle'), (
            <div>
                <p>{t('errors:sessionExpiredDesc')}</p>
                <div className="btn-container">
                    <button onClick={() => {
                        setIsModalVisible(false);
                        navigate('/login');
                    }}>
                        {t('forms:login')}
                    </button>
                </div>
            </div>
        ));
    }

    // Function to handle login button click by navigating to login page and hiding any modals
    const handleLoginClick = () => {
        navigate('/login');
        setIsModalVisible(false);
    };

    // Function to handle go back button click by navigating back and hiding any modals
    const handleGoBackClick = () => {
        navigate(-1);
        setIsModalVisible(false);
    };

    // Function to show a modal with given title and content
    const showModal = (title, children) => {
        setModalContent({ title, children });
        setIsModalVisible(true);
    };

    // Context value to be provided to consuming components, including authentication state and functions
    const contextValue = {
        isAuthenticated,
        handleLogin,
        handleLogout,
        handleSessionExpired,
        handleLoginClick,
        handleGoBackClick,
        showModal,
    }

    // Render the AuthContext provider with the context value and include the WarningModal component for displaying modals
    return (
        <AuthContext.Provider value={contextValue} >
            {props.children}
            <WarningModal 
                isVisible={isModalVisible} 
                title={modalContent.title}
            >
                {modalContent.children}
            </WarningModal>
        </AuthContext.Provider>
    );
}