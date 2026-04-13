import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { useTranslation } from 'react-i18next';
import { BASE_URL } from '../services/utils';

import './Login.css';

export default function Login() {
    const navigate = useNavigate();
    const { login } = useContext(AuthContext);          
    const [error, setError] = useState('');

    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });

    const { t } = useTranslation('auth');

    const validateForm = () => {
        if (formData.email.trim() === '') {
            setError(t('emailRequired'));
            return false;
        }

        if (formData.password.trim() === '') {
            setError(t('passwordRequired'));
            return false;
        }

        return true;
    };

    const changeHandler = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const submitHandler = async (e) => {
        e.preventDefault();

        if (!validateForm()) 
            return;

        try {
            const response = await fetch(`${BASE_URL}/admin-login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();          

            if (!data.success) {
                throw new Error(data.message || data.errors || t('loginFailed'));
            }

            // Login successful – store token and user via context
            login(data.token, data.user);
            navigate('/list-products');
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="admin-login">
            <h1>{t('adminLogin')}</h1>
            {error && <p className="error">{error}</p>}
            <form onSubmit={submitHandler}>
                <div>
                    <label htmlFor="email">{t('email')}</label>
                    <input
                        value={formData.email}
                        onChange={changeHandler}
                        type="email"
                        name="email"
                        placeholder={t('emailPlaceholder')}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="password">{t('password')}</label>
                    <input
                        value={formData.password}
                        onChange={changeHandler}
                        type="password"
                        name="password"
                        placeholder={t('passwordPlaceholder')}
                        required
                    />
                </div>
                <button type="submit">{t('login')}</button>
            </form>
        </div>
    );
}