import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
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

    const validateForm = () => {
        if (formData.email.trim() === '') {
            setError('Email is required');
            return false;
        }

        if (formData.password.trim() === '') {
            setError('Password is required');
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
                throw new Error(data.message || data.errors || 'Login failed');
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
            <h1>Admin Login</h1>
            {error && <p className="error">{error}</p>}
            <form onSubmit={submitHandler}>
                <div>
                    <label htmlFor="email">Email</label>
                    <input
                        value={formData.email}
                        onChange={changeHandler}
                        type="email"
                        name="email"
                        placeholder='Enter email...'
                        required
                    />
                </div>
                <div>
                    <label htmlFor="password">Password</label>
                    <input
                        value={formData.password}
                        onChange={changeHandler}
                        type="password"
                        name="password"
                        placeholder="Enter password..."
                        required
                    />
                </div>
                <button type="submit">Login</button>
            </form>
        </div>
    );
}