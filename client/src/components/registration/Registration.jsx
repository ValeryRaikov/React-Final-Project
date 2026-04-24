import { useContext, useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useGoogleLogin } from '@react-oauth/google';
import ReCAPTCHA from 'react-google-recaptcha';
import { AuthContext } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import { FaEye, FaEyeSlash, FaGoogle } from 'react-icons/fa';

import './Registration.css';

const BASE_URL = import.meta.env.VITE_BASE_URL;

export default function Registration() {
    const { handleLogin } = useContext(AuthContext);
    const { addNotification } = useNotification();
    const { t } = useTranslation(['navigation', 'forms', 'errors', 'others']);

    const navigate = useNavigate();
    const recaptchaRef = useRef();

    const [mode, setMode] = useState('login');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        agree: false,
    });

    const RECAPTCHA_SITE_KEY = import.meta.env.VITE_RECAPTCHA_SITE_KEY;

    const changeHandler = (e) => {
        setFormData({
            ...formData,
            [e.target.name]:
                e.target.type === 'checkbox'
                    ? e.target.checked
                    : e.target.value,
        });
    };

    // Google Sign-In Handler
    const googleLogin = useGoogleLogin({
        onSuccess: async (codeResponse) => {
            setIsLoading(true);
            try {
                const recaptchaToken = recaptchaRef.current?.getValue();
                if (!recaptchaToken) {
                    addNotification(t('forms:recaptchaRequired'), 'error');
                    setIsLoading(false);
                    return;
                }

                const response = await fetch(`${BASE_URL}/google-signin`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        code: codeResponse.code,
                        recaptchaToken: recaptchaToken,
                    }),
                });

                const result = await response.json();

                if (!response.ok || !result.success) {
                    addNotification(
                        result.errors || t('forms:googleSigninError'),
                        'error'
                    );
                    return;
                }

                localStorage.setItem('auth-token', result.token);
                handleLogin();
                addNotification(t('forms:loginSuccess'), 'success');
                navigate('/');
            } catch (err) {
                console.error('Google sign-in error:', err);
                addNotification(t('forms:googleSigninError'), 'error');
            } finally {
                setIsLoading(false);
            }
        },
        onError: (error) => {
            console.error('Google login error:', error);
            addNotification(t('forms:googleSigninError'), 'error');
        },
        flow: 'auth-code',
    });

    const validateForm = () => {
        const recaptchaToken = recaptchaRef.current?.getValue();
        if (!recaptchaToken) {
            addNotification(t('forms:recaptchaRequired'), 'error');
            return false;
        }

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

        return recaptchaToken;
    };

    const login = async () => {
        const recaptchaToken = validateForm();
        if (!recaptchaToken) return;

        setIsLoading(true);
        try {
            const response = await fetch(`${BASE_URL}/login`, {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...formData,
                    recaptchaToken: recaptchaToken,
                }),
            });

            const result = await response.json();

            if (!response.ok || !result.success) {
                addNotification(
                    result.errors || t('errors:loginFailed'),
                    'error'
                );
                recaptchaRef.current?.reset();
                return;
            }

            localStorage.setItem('auth-token', result.token);
            handleLogin();
            addNotification(t('forms:loginSuccess'), 'success');
            navigate('/');
        } catch (err) {
            addNotification(t('errors:somethingWentWrong'), 'error');
            recaptchaRef.current?.reset();
        } finally {
            setIsLoading(false);
        }
    };

    const signup = async () => {
        const recaptchaToken = validateForm();
        if (!recaptchaToken) return;

        setIsLoading(true);
        try {
            const response = await fetch(`${BASE_URL}/signup`, {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...formData,
                    recaptchaToken: recaptchaToken,
                }),
            });

            const result = await response.json();

            if (!response.ok || !result.success) {
                addNotification(
                    result.errors || t('errors:signupFailed'),
                    'error'
                );
                recaptchaRef.current?.reset();
                return;
            }

            localStorage.setItem('auth-token', result.token);
            handleLogin();
            addNotification(t('forms:signupSuccess'), 'success');
            navigate('/');
        } catch (err) {
            addNotification(t('errors:somethingWentWrong'), 'error');
            recaptchaRef.current?.reset();
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="registration">
            <div className="registration-container">
                <div className="registration-header">
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
                            className="field-input"
                        />
                    )}

                    <input
                        onChange={changeHandler}
                        value={formData.email}
                        type="email"
                        name="email"
                        placeholder={t('forms:emailAddress')}
                        className="field-input"
                    />

                    <div className="password-field">
                        <input
                            onChange={changeHandler}
                            value={formData.password}
                            type={showPassword ? 'text' : 'password'}
                            name="password"
                            placeholder={t('forms:passwordLabel')}
                            className="field-input password-input"
                        />
                        <span
                            className="password-eye"
                            onClick={() => setShowPassword(!showPassword)}
                            role="button"
                            tabIndex={0}
                            aria-label={showPassword ? 'Hide password' : 'Show password'}
                        >
                            {showPassword ? <FaEyeSlash /> : <FaEye />}
                        </span>
                    </div>
                </div>

                <label className="registration-agree">
                    <input
                        checked={formData.agree}
                        onChange={changeHandler}
                        type="checkbox"
                        name="agree"
                    />
                    <span>{t('forms:agreeTerms')}</span>
                </label>

                <button
                    className="submit-btn"
                    onClick={() =>
                        mode === 'login' ? login() : signup()
                    }
                    disabled={isLoading}
                >
                    {isLoading ? (t('forms:loading') || 'Loading...') : t('forms:continue')}
                </button>

                <div className="divider-or">
                    <span>{t('others:or')}</span>
                </div>

                <button
                    className="google-signin-btn"
                    onClick={() => googleLogin()}
                    disabled={isLoading}
                    type="button"
                >
                    <FaGoogle className="google-icon" />
                    {t('forms:continueWithGoogle')}
                </button>

                <div className="recaptcha-container">
                    <ReCAPTCHA
                        ref={recaptchaRef}
                        sitekey={RECAPTCHA_SITE_KEY}
                        theme="light"
                    />
                </div>

                <p className="registration-switch">
                    {mode === 'signup' ? (
                        <>
                            {t('forms:alreadyHaveAccount')}
                            <span onClick={() => setMode('login')}>
                                {' '}{t('forms:loginHere')}
                            </span>
                        </>
                    ) : (
                        <>
                            {t('forms:createAccount')}
                            <span onClick={() => setMode('signup')}>
                                {' '}{t('forms:clickHere')}
                            </span>
                        </>
                    )}
                </p>
            </div>
        </div>
    );
}