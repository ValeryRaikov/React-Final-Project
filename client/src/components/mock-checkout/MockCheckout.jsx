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
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        city: '',
        address: '',
        postalCode: '',
        phone: '',
        comment: '',
    });

    const { t } = useTranslation('order');
    const amount = params.get('amount');

    const handleChange = (e) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    const isFormValid = () => {
        return (
            formData.firstName.trim() &&
            formData.lastName.trim() &&
            formData.city.trim() &&
            formData.address.trim() &&
            formData.postalCode.trim() &&
            formData.phone.trim()
        );
    };

    const handlePay = async () => {
        if (!isFormValid()) {
            setError('Please fill all required fields');
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            const res = await fetch(`${BASE_URL}/confirm-payment`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'auth-token': localStorage.getItem('auth-token')
                },
                body: JSON.stringify({
                    shippingDetails: formData
                })
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
                <div className="checkout-form">
                    <p className='fill-info-title'>* {t('fillOrderInfo')}</p>
                    <div className="form-row">
                        <input
                            type="text"
                            name="firstName"
                            placeholder={t('firstName')}
                            value={formData.firstName}
                            onChange={handleChange}
                        />
                        <input
                            type="text"
                            name="lastName"
                            placeholder={t('lastName')}
                            value={formData.lastName}
                            onChange={handleChange}
                        />
                    </div>
                    <input
                        type="text"
                        name="city"
                        placeholder={t('city')}
                        value={formData.city}
                        onChange={handleChange}
                    />
                    <input
                        type="text"
                        name="address"
                        placeholder={t('address')}
                        value={formData.address}
                        onChange={handleChange}
                    />
                    <div className='form-row'>
                        <input
                            type="text"
                            name="postalCode"
                            placeholder={t('postalCode')}
                            value={formData.postalCode}
                            onChange={handleChange} 
                        />
                        <input
                            type="text"
                            name="phone"
                            placeholder={t('phone')}
                            value={formData.phone}
                            onChange={handleChange}
                        />
                    </div>
                    <textarea
                        name="comment"
                        placeholder={t('orderComment')}
                        value={formData.comment}
                        onChange={handleChange}
                    />
                </div>
                <p className="amount-label">{t('totalAmount')}</p>
                <div className="amount-value">
                    ${parseFloat(amount).toFixed(2)}
                </div>
                {error && (
                <div className="error-message">
                    ⚠️ {error}
                </div>
                )}
                <button
                    className="pay-button"
                    onClick={handlePay}
                    disabled={isLoading || !isFormValid()}
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