import { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../../../context/AuthContext';

import Warning from '../../../warning/Warning';

import { errMsg, BASE_URL } from '../../utils';
import '../UserDisplay.css';

export default function ListUser() {
    const { isAuthenticated, admin } = useContext(AuthContext);
    const [allUsers, setAllUsers] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

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
                        setError('Session expired. Please login again.');
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
        if (!admin) return false;
        
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
                            <p className="error-message">You do not have permission to view users. Only admins can manage users.</p>
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
                        <h1>All Users</h1>
                        <div className="list-user-format-main">
                            <p>Name</p>
                            <p>Email</p>
                            <p>Role</p>
                            <p>Status</p>
                            <p>Edit</p>
                            <p>Remove</p>
                        </div>
                        <div className="list-user-all-users">
                            <hr />
                            {loading 
                                ? <p className="loading-message">Loading...</p>
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
                                                {user.isActive ? 'Active' : 'Inactive'}
                                            </span>
                                        </p>
                                        <p 
                                            className={canManageUser(user) ? 'edit-btn' : 'edit-btn disabled'}
                                            onClick={() => canManageUser(user) && editClickHandler(user._id)}
                                        >
                                            Edit
                                        </p>
                                        <p 
                                            className={canManageUser(user) ? 'delete-btn' : 'delete-btn disabled'}
                                            onClick={() => canManageUser(user) && deleteClickHandler(user._id)}
                                        >
                                            Remove
                                        </p>
                                    </div>
                                ))
                                : <p className="no-users-message">No users available.</p>
                            }
                        </div>
                        <hr />
                    </div>
                )
            }
        </>
    );
}
