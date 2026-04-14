import { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../../../context/AuthContext';
import { useTranslation } from 'react-i18next';

import Warning from '../../../warning/Warning';

import { errMsg, BASE_URL } from '../../utils';
import '../UserDisplay.css';

export default function ListUser() {
    const { isAuthenticated, admin } = useContext(AuthContext);
    const [allUsers, setAllUsers] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const { t } = useTranslation(['admins', 'auth', 'common', 'others']);

    useEffect(() => {
        (async () => {
            setLoading(true);
            setError(null);

            try {
                const response = await fetch(`${BASE_URL}/admin-users`, {
                    headers: {
                        'auth-token': localStorage.getItem('auth-token'),
                    },
                });

                if (!response.ok) {
                    if (response.status === 401) {
                        setError(t('auth:sessionExpired'));
                        return;
                    }

                    throw new Error(errMsg.fetchUsers || 'Failed to fetch users');
                }

                const result = await response.json();
                setAllUsers(result.data || []);
            } catch (err) {
                setError(err.message || errMsg.unexpected);
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    const editClickHandler = (id) => {
        navigate(`/edit-user/${id}`);
    };

    const deleteClickHandler = (id) => {
        navigate(`/delete-user/${id}`);
    };

    const getRoleBadgeClass = (role) => {
        switch (role) {
            case 'superadmin':
                return 'role-superadmin';
            case 'admin':
                return 'role-admin';
            case 'operator':
                return 'role-operator';
            default:
                return '';
        }
    };

    const canManageUser = (user) => {
        if (!admin) 
            return false;
        
        // Superadmin can manage everyone
        if (admin.role === 'superadmin') 
            return true;
        
        // Admin cannot manage superadmin
        if (user.role === 'superadmin') 
            return false;
        
        // Admin can manage other admins and operators
        if (admin.role === 'admin') 
            return true;
        
        // Operators cannot manage anyone
        return false;
    };

    // Only superadmin and admin can view users list
    if (admin && admin.role === 'operator') {
        return (
            <>
                {!isAuthenticated 
                    ? <Warning />
                    : (
                        <div className="list-user-restricted">
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
                    <div className="list-user">
                        <h1>{t('admins:allUsers')}</h1>
                        <div className="list-user-format-main">
                            <p>{t('admins:name')}</p>
                            <p>{t('admins:email')}</p>
                            <p>{t('admins:role')}</p>
                            <p>{t('admins:status')}</p>
                            <p>{t('common:edit')}</p>
                            <p>{t('common:delete')}</p>
                        </div>
                        <div className="list-user-all-users">
                            <hr />
                            {loading 
                                ? <p className="loading-message">{t('others:loading')}</p>
                                : error 
                                ? <p className="error-message">{error}</p>
                                : allUsers.length > 0 
                                ? allUsers.map((user) => (
                                    <div key={user._id} className="list-user-format">
                                        <p>{user.name}</p>
                                        <p>{user.email}</p>
                                        <p>
                                            <span className={`role-badge ${getRoleBadgeClass(user.role)}`}>
                                                {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                                            </span>
                                        </p>
                                        <p>
                                            <span className={`status-badge ${user.isActive ? 'active' : 'inactive'}`}>
                                                {user.isActive ? t('admins:active') : t('admins:inactive')}
                                            </span>
                                        </p>
                                        <p 
                                            className={canManageUser(user) ? 'edit-btn' : 'edit-btn disabled'}
                                            onClick={() => canManageUser(user) && editClickHandler(user._id)}
                                        >
                                            {t('common:edit')}
                                        </p>
                                        <p 
                                            className={canManageUser(user) ? 'delete-btn' : 'delete-btn disabled'}
                                            onClick={() => canManageUser(user) && deleteClickHandler(user._id)}
                                        >
                                            {t('common:delete')}
                                        </p>
                                    </div>
                                ))
                                : <p className="no-users-message">{t('admins:noUsersAvailable')}</p>
                            }
                        </div>
                        <hr />
                    </div>
                )
            }
        </>
    );
}
