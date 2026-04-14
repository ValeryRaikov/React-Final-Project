import { useContext, useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../../../context/AuthContext';
import { useTranslation } from 'react-i18next';

import Warning from '../../../warning/Warning';
import { errMsg, BASE_URL } from '../../utils';

import '../UserForm.css';

export default function DeleteUser() {
    const { isAuthenticated, admin } = useContext(AuthContext);
    const { userId } = useParams();
    const navigate = useNavigate();
    const { t } = useTranslation(['admins', 'auth']);
    const [user, setUser] = useState({
        name: '',
        email: '',
        role: t('admins:operator'),
    });
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

    const canDeleteUser = () => {
        if (!admin) 
            return false;
        
        // Cannot delete yourself
        if (admin._id === userId) 
            return false;
        
        // Superadmin can delete everyone except if trying to delete last superadmin
        if (admin.role === 'superadmin') 
            return true;
        
        // Admin cannot delete superadmin
        if (user.role === 'superadmin') 
            return false;
        
        // Admin can delete other admins and operators
        if (admin.role === 'admin') 
            return true;
        
        // Operators cannot delete anyone
        return false;
    };

    const deleteHandler = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const response = await fetch(`${BASE_URL}/admin-user-delete/${userId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'auth-token': localStorage.getItem('auth-token'),
                },
            });

            if (!response.ok) {
                if (response.status === 401) {
                    setError(t('auth:sessionExpired'));
                    return;
                }

                const errorData = await response.json();

                throw new Error(errorData.message || errMsg.deleteUser || 'Failed to delete user');
            }

            setSuccessMessage(t('admins:userDeletedSuccess'));
            setTimeout(() => {
                navigate('/list-users');
            }, 1500);
        } catch (err) {
            setError(err.message || errMsg.unexpected);
        } finally {
            setLoading(false);
        }
    };

    // Only superadmin and admin can delete users
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
                    <form className="user-form" onSubmit={deleteHandler}>
                        <h2>{t('admins:deleteUserTitle')}</h2>

                        {error && <p className="error-message">{error}</p>}
                        {successMessage && <p className="success-message">{successMessage}</p>}

                        {loading ? (
                            <p className="loading-message">{t('others:loading')}</p>
                        ) : !canDeleteUser() ? (
                            <div className="delete-restrictions">
                                {admin._id === userId ? (
                                    <p className="error-message">{t('admins:cannotDeleteOwnAccount')}</p>
                                ) : user.role === 'superadmin' && admin.role !== 'superadmin' ? (
                                    <p className="error-message">{t('admins:onlySuperAdminsCanDeleteSuperAdmins')}</p>
                                ) : (
                                    <p className="error-message">{t('admins:permissionDeniedDeleteUser')}</p>
                                )}
                            </div>
                        ) : (
                            <>
                                <div className="user-itemfield">
                                    <p>{t('admins:name')}</p>
                                    <input
                                        value={user.name}
                                        type="text"
                                        name="name"
                                        placeholder={t('admins:namePlaceholder')}
                                        disabled
                                    />
                                </div>

                                <div className="user-itemfield">
                                    <p>{t('admins:email')}</p>
                                    <input
                                        value={user.email}
                                        type="email"
                                        name="email"
                                        placeholder={t('admins:emailPlaceholder')}
                                        disabled
                                    />
                                </div>

                                <div className="user-itemfield">
                                    <p>{t('admins:role')}</p>
                                    <input
                                        value={user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                                        type="text"
                                        name="role"
                                        placeholder={t('admins:rolePlaceholder')}
                                        disabled
                                    />
                                </div>

                                {user.role === 'superadmin' && (
                                    <div className="delete-warning">
                                        <p className="warning-text">{t('admins:warningDeleteSuperAdmin')}</p>
                                    </div>
                                )}

                                {(user.role === 'admin' || user.role === 'superadmin') && (
                                    <div className="delete-warning">
                                        <p className="warning-text">{t('admins:warningDeleteAdmin')}</p>
                                    </div>
                                )}

                                <button type="submit" className="user-btn delete-btn" disabled={loading}>
                                    {loading ? t('admins:deletingUser') : t('admins:deleteUser')}
                                </button>
                            </>
                        )}
                    </form>
                )
            }
        </>
    );
}
