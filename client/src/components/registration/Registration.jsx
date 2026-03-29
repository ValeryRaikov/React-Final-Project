import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';

import './Registration.css';

const BASE_URL = import.meta.env.VITE_BASE_URL;

export default function Registration() {
    const { handleLogin } = useContext(AuthContext);
    const { addNotification } = useNotification();

    const navigate = useNavigate();
    // const [error, setError] = useState(null);
    const [state, setState] = useState('Login');
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        agree: false,
    });

    const changeHandler = (e) => {
        setFormData({
            ...formData, 
            [e.target.name]: e.target.type === 'checkbox' 
                ? e.target.checked 
                : e.target.value,
        });
    }

    const validateForm = () => {
        if (state === 'Sign Up' && formData.name.trim() === '') {
            // setError('Name is required');
            addNotification('Name is required', 'error');
            return false;
        }

        if (formData.email.trim() === '') {
            // setError('Email is required');
            addNotification('Email is required', 'error');
            return false;
        }

        if (formData.password.trim() === '') {
            // setError('Password is required');
            addNotification('Password is required', 'error');
            return false;
        }

        if (!formData.agree) {
            // setError('You must agree to the terms of use & privacy policy.');
            addNotification('You must agree to the terms of use & privacy policy.', 'error');
            return false;
        }

        return true;
    };

    const login = async () => {
        if (!validateForm()) {
            return;
        }

        try {
            const response = await fetch(`${BASE_URL}/login`, {
                method: 'POST',
                headers: {
                    Accept: 'application/form-data',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                const errorResponse = await response.json();
                addNotification(errorResponse.errors || 'Login Error!', 'error');
                throw new Error(errorResponse.errors || 'Login Error!');
            }

            const result = await response.json();

            if (result.success) {
                localStorage.setItem('auth-token', result.token);
                handleLogin();
                addNotification('Login successful', 'success');
                navigate('/');
            } else {
                // setError(result.errors);
                addNotification(result.errors, 'error');
            }
        } catch (err) {
            // setError(err.message);
            addNotification(err.message, 'error');
        }
    }

    const signup = async () => {
        if (!validateForm()) {
            return;
        }

        try {
            const response = await fetch(`${BASE_URL}/signup`, {
                method: 'POST',
                headers: {
                    Accept: 'application/form-data',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                const errorResponse = await response.json();
                addNotification(errorResponse.errors || 'SignUp Error!', 'error');
                throw new Error(errorResponse.errors || 'SignUp Error!');
            }

            const result = await response.json();

            if (result.success) {
                localStorage.setItem('auth-token', result.token);
                handleLogin();
                addNotification('Sign up successful', 'success');
                navigate('/');
            } else {
                // setError(result.errors);
                addNotification(result.errors, 'error');
            }
        } catch (err) {
            // setError(err.message);
            addNotification(err.message, 'error');
        }
    }

    return (
        <div className="registration">
            <div className="registration-container">
                <div className="registration-header-box">
                    <h1>{state}</h1>
                    {/* {error 
                        ? <p className="error-message">{error}</p> 
                        : <></>
                    } */}
                </div>
                <div className="registration-fields">
                    {state === 'Sign Up' 
                        ? <input 
                                onChange={changeHandler}
                                value={formData.name}
                                type="text" 
                                name="name" 
                                placeholder="Your name" 
                            />
                        : <></>
                    }
                    <input 
                        onChange={changeHandler}
                        value={formData.email}
                        type="email" 
                        name="email" 
                        placeholder="Email address" 
                    />
                    <input 
                        onChange={changeHandler}
                        value={formData.password}
                        type="password" 
                        name="password" 
                        placeholder="Password" 
                    />
                </div>
                <button onClick={() => state === 'Login' ? login(): signup()}>Continue</button>
                {state === 'Sign Up' 
                    ? <p className="registration-login">Already have an account? 
                        <span onClick={() => setState('Login')}> Login here</span>
                    </p>
                    : <p className="registration-login">Create an account? 
                        <span onClick={() => setState('Sign Up')}> Click here</span>
                    </p>
                }
                <div className="registration-agree">
                    <input 
                        checked={formData.agree}
                        onChange={changeHandler} 
                        type="checkbox" 
                        name="agree" 
                    />
                    <p>By continuing, I agree to the terms of use & privacypolicy.</p>
                </div>
            </div>
        </div>
    );
}