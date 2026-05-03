import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import './PaymentSuccess.css';   

export default function Success() {
    const { t } = useTranslation('order');

    return (
        <div className="success-container">
            <div className="success-card">
                <div className="success-icon">🎉</div>
                <h2 className="success-title">{t('paymentSuccess')}</h2>
                <p className="success-message">
                    {t('paymentSuccessMessage')}
                </p>
                <Link to="/" className="return-link">
                    {t('returnBack')}
                </Link>
            </div>
        </div>
    );
}