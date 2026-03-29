import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useNotification } from '../../context/NotificationContext';
import { AuthContext } from '../../context/AuthContext';

import './Profile.css';
import profile_icon from '../assets/profile_icon.png';

const BASE_URL = import.meta.env.VITE_BASE_URL;

export default function Profile() {
    const { handleLogout } = useContext(AuthContext);
    const { addNotification } = useNotification();

    const [user, setUser] = useState(null);
    const [passwords, setPasswords] = useState({
        oldPassword: '',
        newPassword: '',
    });

    const navigate = useNavigate();

    // Fetch profile
    useEffect(() => {
        fetch(`${BASE_URL}/profile`, {
            headers: {
                'auth-token': localStorage.getItem('auth-token')
            }
        })
        .then(res => res.json())
        .then(data => setUser(data.user))
        .catch(err => console.error(err));
    }, []);

    // Change password
    const handleChangePassword = async () => {
        try {
            const res = await fetch(`${BASE_URL}/change-password`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'auth-token': localStorage.getItem('auth-token')
                },
                body: JSON.stringify(passwords)
            });

            const data = await res.json();

            if (data.success) {
                // alert('Password updated');
                setPasswords({
                    oldPassword: '',
                    newPassword: ''
                });
                addNotification('Password updated successfully!', 'success');
                navigate('/');
            } else {
                addNotification('Password mismatch. Try again!', 'error');
            }
        } catch (err) {
            console.error(err);
            addNotification('Failed to update password', 'error');
        }
    };

    // Delete account
    const handleDeleteAccount = async () => {
        try {
            const confirmDelete = window.confirm('Are you sure?');

            if (!confirmDelete) 
                return;

            const response = await fetch(`${BASE_URL}/delete-account`, {
                method: 'DELETE',
                headers: {
                    'auth-token': localStorage.getItem('auth-token'),
                },
            });

            const data = await response.json();

            if (data.success) {
                localStorage.removeItem('auth-token');  
                addNotification('Account deleted successfully', 'success');
                handleLogout();                         
                navigate('/');                          
            } else {
                addNotification('Failed to delete account', 'error');
            }
        } catch (err) {
            console.error(err);
            addNotification('Failed to delete account', 'error');
        }
    };

    if (!user) 
        return <p>Loading...</p>;

    return (
        <div className="profile-background">
            <div className="profile-page">
                <div className="profile-header">
                    <h1>My Profile</h1>
                    <img 
                        src={profile_icon} 
                        alt="profile_icon" 
                        className="profile-avatar"
                    />
                </div>

                <p><strong>Name:</strong> {user.name}</p>
                <p><strong>Email:</strong> {user.email}</p>

                <h3>Change Password</h3>
                <input
                    type="password"
                    placeholder="Current Password"
                    onChange={(e) => setPasswords({ ...passwords, oldPassword: e.target.value })}
                />
                <input
                    type="password"
                    placeholder="New Password"
                    onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })}
                />
                <button onClick={handleChangePassword}>
                    Update Password
                </button>
                
                <h3>Danger Zone</h3>
                <button onClick={handleDeleteAccount}>
                    Delete Account
                </button>
            </div>
        </div>
    );
}