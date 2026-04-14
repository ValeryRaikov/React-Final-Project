import { useContext, useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../../../context/AuthContext';
import { useTranslation } from 'react-i18next';

import Warning from '../../../warning/Warning';
import { errMsg, BASE_URL } from '../../utils';

import '../UserForm.css';

export default function EditUser() {
    const { isAuthenticated, admin } = useContext(AuthContext);
    const { userId } = useParams();
    const navigate = useNavigate();
    const { t } = useTranslation(['admins', 'auth', 'others']);
    const [user, setUser] = useState({
        name: '',
        email: '',
        role: t('admins:operator'),
        isActive: true,
    });
    const [passwordUpdate, setPasswordUpdate] = useState('');
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        (async () => {
            setLoading(true);
            setError(null);

            try {
                const response = await fetch(`${BASE_URL}/admin-user/${userId}`, {
                    headers: {
                        'auth-token': localStorage.getItem('auth-token'),
                    },
                });

                if (!response.ok) {
                    if (response.status === 401) {
                        setError(t('auth:sessionExpired'));
                        return;
                    }

                    throw new Error(errMsg.fetchUser || 'Failed to fetch user');
                }

                const result = await response.json();
                setUser(result.data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        })();
    }, [userId]);

    const changeHandler = (e) => {
        const { name, value, type, checked } = e.target;
        setUser({
            ...user,
            [name]: type === 'checkbox' ? checked : value,
        });
    };

    const canEditUser = () => {
        if (!admin) 
            return false;
        
        // Superadmin can edit everyone
        if (admin.role === 'superadmin') 
            return true;
        
        // Admin cannot edit superadmin
        if (user.role === 'superadmin') 
            return false;
        
        // Admin can edit other admins and operators
        if (admin.role === 'admin') 
            return true;
        
        // Operators cannot edit anyone
        return false;
    };

    const canChangeRole = () => {
        if (!admin) 
            return false;
        
        // Only superadmin can change to superadmin role
        if (user.role === 'superadmin' && admin.role !== 'superadmin') {
            return false;
        }
        
        return canEditUser();
    };

    const submitHandler = async (e) => {
        e.preventDefault();

        setLoading(true);
        setError(null);

        try {
            const updateData = {
                ...user,
            };

            // Only include password if it's being updated
            if (passwordUpdate) {
                updateData.password = passwordUpdate;
            }

            const response = await fetch(`${BASE_URL}/admin-user-update/${userId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'auth-token': localStorage.getItem('auth-token'),
                },
                body: JSON.stringify(updateData),
            });

            if (!response.ok) {
                if (response.status === 401) {
                    setError(t('auth:sessionExpired'));
                    return;
                }

                const errorData = await response.json();

                throw new Error(errorData.message || errMsg.updateUser || 'Failed to update user');
            }

            const result = await response.json();

            if (result.success) {
                setSuccessMessage(t('admins:userUpdatedSuccess'));
                setTimeout(() => {
                    navigate('/list-users');
                }, 1500);
            } else {
                throw new Error(result.message || errMsg.updateUser);
            }
        } catch (err) {
            setError(err.message || errMsg.unexpected);
        } finally {
            setLoading(false);
        }
    };

    // Only superadmin and admin can edit users
    if (admin && admin.role === 'operator') {
        return (
            <>
                {!isAuthenticated 
                    ? <Warning />
                    : (
                        <div className="user-form-restricted">
                                <p className="error-message">{t('admins:permissionDeniedManageUsers')}</p>
                            </div>
                    )
                }
            </>
        );
    }

    return (
        <>
            {!isAuthenticated 
                ? <Warning />
                : (
                    <form className="user-form" onSubmit={submitHandler}>
                        <h2>{t('admins:editUserTitle')}</h2>

                        {error && <p className="error-message">{error}</p>}
                        {successMessage && <p className="success-message">{successMessage}</p>}

                        {loading ? (
                            <p className="loading-message">{t('others:loading')}</p>
                        ) : !canEditUser() ? (
                            <p className="error-message">{t('admins:permissionDeniedEditUser')}</p>
                        ) : (
                            <>
                                <div className="user-itemfield">
                                    <p>{t('admins:name')}</p>
                                    <input
                                        value={user.name}
                                        onChange={changeHandler}
                                        type="text"
                                        name="name"
                                        placeholder={t('admins:namePlaceholder')}
                                        disabled={!canEditUser()}
                                    />
                                </div>

                                <div className="user-itemfield">
                                    <p>{t('admins:email')}</p>
                                    <input
                                        value={user.email}
                                        onChange={changeHandler}
                                        type="email"
                                        name="email"
                                        placeholder={t('admins:emailPlaceholder')}
                                        disabled={!canEditUser()}
                                    />
                                </div>

                                <div className="user-itemfield">
                                    <p>{t('admins:updatePassword')}</p>
                                    <input
                                        value={passwordUpdate}
                                        onChange={(e) => setPasswordUpdate(e.target.value)}
                                        type="password"
                                        placeholder={t('admins:updatePasswordPlaceholder')}
                                        disabled={!canEditUser()}
                                    />
                                </div>

                                <div className="user-itemfield">
                                    <p>{t('admins:role')}</p>
                                    <select
                                        value={user.role}
                                        onChange={changeHandler}
                                        name="role"
                                        className="user-selector"
                                        disabled={!canChangeRole()}
                                    >
                                        {admin && admin.role === 'superadmin' && (
                                            <option value="superadmin">{t('admins:superAdmin')}</option>
                                        )}
                                        <option value="admin">{t('admins:admin')}</option>
                                        <option value="operator">{t('admins:operator')}</option>
                                    </select>
                                    {user.role === 'superadmin' && admin?.role !== 'superadmin' && (
                                        <small className="disabled-note">{t('admins:permissionDeniedSuperAdmin')}</small>
                                    )}
                                </div>

                                <div className="user-checkbox">
                                    <input
                                        type="checkbox"
                                        name="isActive"
                                        checked={user.isActive}
                                        onChange={changeHandler}
                                        id="isActive"
                                        disabled={!canEditUser()}
                                    />
                                    <label htmlFor="isActive">{t('admins:active')}</label>
                                </div>

                                <button type="submit" className="user-btn" disabled={loading || !canEditUser()}>
                                    {loading ? t('admins:updatingUser') : t('admins:editUser')}
                                </button>
                            </>
                        )}
                    </form>
                )
            }
        </>
    );
}
