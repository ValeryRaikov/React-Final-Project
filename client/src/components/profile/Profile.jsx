import { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useNotification } from '../../context/NotificationContext';
import { AuthContext } from '../../context/AuthContext';
import WarningModal from '../warning-modal/WarningModal';

import './Profile.css';
import profile_icon from '../assets/profile_icon.png';

const BASE_URL = import.meta.env.VITE_BASE_URL;

export default function Profile() {
    const { handleLogout } = useContext(AuthContext);
    const { addNotification } = useNotification();
    const { t } = useTranslation(['forms', 'errors']);

    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [user, setUser] = useState(null);
    const [passwords, setPasswords] = useState({
        oldPassword: '',
        newPassword: '',
    });

    const navigate = useNavigate();

    // Fetch profile
    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await fetch(`${BASE_URL}/profile`, {
                    headers: {
                        'auth-token': localStorage.getItem('auth-token')
                    }
                });

                if (!res.ok) {
                    throw new Error('Failed to fetch profile');
                }

                const data = await res.json();
                setUser(data.user);
            } catch (err) {
                console.error(err);
            }
        };

        fetchProfile();
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
                setPasswords({
                    oldPassword: '',
                    newPassword: ''
                });

                addNotification(t('forms:passwordUpdated'), 'success');

                localStorage.removeItem('auth-token'); 
                handleLogout();                        
                navigate('/login');                    
            } else {
                addNotification(t('errors:passwordMismatch'), 'error');
            }
        } catch (err) {
            console.error(err);
            addNotification(t('errors:failedToUpdatePassword'), 'error');
        }
    };

    // Delete account click - shows confirmation modal
    const handleDeleteClick = () => {
        setShowDeleteModal(true);
    };

    // Delete account confirmation
    const confirmDeleteAccount = async () => {
        try {
            const response = await fetch(`${BASE_URL}/delete-account`, {
                method: 'DELETE',
                headers: {
                    'auth-token': localStorage.getItem('auth-token'),
                },
            });

            const data = await response.json();

            if (data.success) {
                localStorage.removeItem('auth-token');  
                addNotification(t('forms:signupSuccess'), 'success');
                handleLogout();                         
                navigate('/');                          
            } else {
                addNotification(t('errors:unexpectedError'), 'error');
            }
        } catch (err) {
            console.error(err);
            addNotification(t('errors:unexpectedError'), 'error');
        } finally {
            setShowDeleteModal(false);
        }
    };

    if (!user) 
        return <p>{t('pages:loading')}</p>;

    return (
        <div className="profile-background">
            <div className="profile-page">
                <div className="profile-header">
                    <h1>{t('myProfile')}</h1>
                    <div className='container-left'>
                        <button onClick={() => navigate('/orders')} className="orders-btn">
                            Orders
                        </button>
                        <img 
                            src={profile_icon} 
                            alt="profile_icon" 
                            className="profile-avatar"
                        />
                    </div>
                </div>

                <p><strong>{t('name')}:</strong> {user.name}</p>
                <p><strong>{t('email')}:</strong> {user.email}</p>

                <h3>{t('changePassword')}</h3>
                <input
                    type="password"
                    placeholder={t('currentPassword')}
                    onChange={(e) => setPasswords({ ...passwords, oldPassword: e.target.value })}
                />
                <input
                    type="password"
                    placeholder={t('newPassword')}
                    onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })}
                />
                <button onClick={handleChangePassword}>
                    {t('updatePassword')}
                </button>
                
                <hr />
                <h3>{t('dangerZone')}</h3>
                <button onClick={handleDeleteClick}>
                    {t('deleteAccount')}
                </button>
            </div>
            <WarningModal
                isVisible={showDeleteModal}
                title={t('confirmDeleteAccount')}
            >
                <p>{t('deleteConfirmation')}</p>
                <p>{t('cannotUndo')}</p>

                <div className="btn-container">
                    <button 
                        style={{ cursor: 'pointer' }}
                        onClick={confirmDeleteAccount}
                    >
                        {t('yesDelete')}
                    </button>

                    <button
                        style={{ backgroundColor: '#999', cursor: 'pointer' }}
                        onClick={() => setShowDeleteModal(false)}
                    >
                        {t('cancel')}
                    </button>
                </div>
            </WarningModal>
        </div>
    );
}