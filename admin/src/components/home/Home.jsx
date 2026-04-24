import { useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { useTranslation } from 'react-i18next';

import './Home.css';

export default function Home() {
    const { t } = useTranslation('others');
    const { isAuthenticated } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        // Redirect to statistics if authenticated
        if (isAuthenticated) {
            navigate('/statistics');
        }
    }, [isAuthenticated, navigate]);

    return (
        <div className="home">
            <h1>{t('welcome')}</h1>
        </div>
    );
}