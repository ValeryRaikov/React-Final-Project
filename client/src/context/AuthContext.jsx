import { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

import WarningModal from "../components/warning-modal/WarningModal";

export const AuthContext = createContext(null);

export default function AuthContextProvider(props) {
    const navigate = useNavigate();
    const { t } = useTranslation(['errors', 'forms']);
    const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('auth-token'));
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [modalContent, setModalContent] = useState({ title: '', children: null });

    useEffect(() => {
        setIsAuthenticated(!!localStorage.getItem('auth-token'));
    }, []);

    const handleLogin = () => {
        setIsAuthenticated(true);
        setIsModalVisible(false);
    }
    
    const handleLogout = () => {
        setIsAuthenticated(false);
    }

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

    const handleLoginClick = () => {
        navigate('/login');
        setIsModalVisible(false);
    };

    const handleGoBackClick = () => {
        navigate(-1);
        setIsModalVisible(false);
    };

    const showModal = (title, children) => {
        setModalContent({ title, children });
        setIsModalVisible(true);
    };

    const contextValue = {
        isAuthenticated,
        handleLogin,
        handleLogout,
        handleSessionExpired,
        handleLoginClick,
        handleGoBackClick,
        showModal,
    }

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