import { useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';

import { FaEye, FaEyeSlash } from 'react-icons/fa';

import './Registration.css';

const BASE_URL = import.meta.env.VITE_BASE_URL;

export default function Registration() {
    const { handleLogin } = useContext(AuthContext);
    const { addNotification } = useNotification();
    const { t } = useTranslation(['navigation', 'forms', 'errors']);

    const navigate = useNavigate();

    const [mode, setMode] = useState('login');
    const [showPassword, setShowPassword] = useState(false); 

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        agree: false,
    });

    const changeHandler = (e) => {
        setFormData({
            ...formData,
            [e.target.name]:
                e.target.type === 'checkbox'
                    ? e.target.checked
                    : e.target.value,
        });
    };

    const validateForm = () => {
        if (mode === 'signup' && formData.name.trim() === '') {
            addNotification(t('errors:nameRequired'), 'error');
            return false;
        }

        if (formData.email.trim() === '') {
            addNotification(t('errors:emailRequired'), 'error');
            return false;
        }

        if (formData.password.trim() === '') {
            addNotification(t('errors:passwordRequired'), 'error');
            return false;
        }

        if (!formData.agree) {
            addNotification(t('errors:agreeRequired'), 'error');
            return false;
        }

        return true;
    };

    const login = async () => {
        if (!validateForm()) return;

        try {
            const response = await fetch(`${BASE_URL}/login`, {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const result = await response.json();

            if (!response.ok || !result.success) {
                addNotification(
                    result.errors || t('errors:loginFailed'),
                    'error'
                );
                return;
            }

            localStorage.setItem('auth-token', result.token);
            handleLogin();
            addNotification(t('forms:loginSuccess'), 'success');
            navigate('/');
        } catch (err) {
            addNotification(t('errors:somethingWentWrong'), 'error');
        }
    };

    const signup = async () => {
        if (!validateForm()) return;

        try {
            const response = await fetch(`${BASE_URL}/signup`, {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const result = await response.json();

            if (!response.ok || !result.success) {
                addNotification(
                    result.errors || t('errors:signupFailed'),
                    'error'
                );
                return;
            }

            localStorage.setItem('auth-token', result.token);
            handleLogin();
            addNotification(t('forms:signupSuccess'), 'success');
            navigate('/');
        } catch (err) {
            addNotification(t('errors:somethingWentWrong'), 'error');
        }
    };

    return (
        <div className="registration">
            <div className="registration-container">
                <div className="registration-header-box">
                    <h1>
                        {mode === 'login'
                            ? t('forms:login')
                            : t('forms:signup')}
                    </h1>
                </div>

                <div className="registration-fields">
                    {mode === 'signup' && (
                        <input
                            onChange={changeHandler}
                            value={formData.name}
                            type="text"
                            name="name"
                            placeholder={t('forms:yourName')}
                            className="name-input"
                        />
                    )}

                    <input
                        onChange={changeHandler}
                        value={formData.email}
                        type="email"
                        name="email"
                        placeholder={t('forms:emailAddress')}
                        className="email-input"
                    />

                    <div className="password-field">
                        <input
                            onChange={changeHandler}
                            value={formData.password}
                            type={showPassword ? 'text' : 'password'}
                            name="password"
                            placeholder={t('forms:passwordLabel')}
                            className="password-input"
                        />

                        <span
                            className="password-eye"
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            {showPassword ? <FaEyeSlash /> : <FaEye />}
                        </span>
                    </div>
                </div>

                <button
                    onClick={() =>
                        mode === 'login' ? login() : signup()
                    }
                >
                    {t('forms:continue')}
                </button>

                {mode === 'signup' ? (
                    <p className="registration-login">
                        {t('forms:alreadyHaveAccount')}
                        <span onClick={() => setMode('login')}>
                            {' '}{t('forms:loginHere')}
                        </span>
                    </p>
                ) : (
                    <p className="registration-login">
                        {t('forms:createAccount')}
                        <span onClick={() => setMode('signup')}>
                            {' '}{t('forms:clickHere')}
                        </span>
                    </p>
                )}

                <div className="registration-agree">
                    <input
                        checked={formData.agree}
                        onChange={changeHandler}
                        type="checkbox"
                        name="agree"
                    />
                    <p>{t('forms:agreeTerms')}</p>
                </div>
            </div>
        </div>
    );
}