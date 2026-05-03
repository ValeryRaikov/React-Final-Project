import { useSearchParams, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import './MockCheckout.css';   

const BASE_URL = import.meta.env.VITE_BASE_URL;

export default function MockCheckout() {
    const [params] = useSearchParams();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const { t } = useTranslation('order');
    const amount = params.get('amount');

    const handlePay = async () => {
        setIsLoading(true);
        setError(null);

        try {
            const res = await fetch(`${BASE_URL}/confirm-payment`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'auth-token': localStorage.getItem('auth-token')
                }
            });

            if (!res.ok) {
                throw new Error('Payment failed');
            }
 
            navigate('/success');
        } catch (err) {
            console.error(err);
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="checkout-container">
            <div className="checkout-card">
                <h2 className="checkout-title">{t('secureCheckout')}</h2>
                <p className="amount-label">{t('totalAmount')}</p>
                <div className="amount-value">
                    ${parseFloat(amount).toFixed(2)}
                </div>
                {error && (
                <div style={{ color: '#f87171', marginBottom: '1rem', fontSize: '0.9rem' }}>
                    ⚠️ {error}
                </div>
                )}
                <button
                    className="pay-button"
                    onClick={handlePay}
                    disabled={isLoading}
                >
                {isLoading ? (
                    <>
                        <span className="spinner"></span> {t('processing')}
                    </>
                    ) : (
                        `${t('payNow')} →`
                )}
                </button>
            </div>
        </div>
    );
}