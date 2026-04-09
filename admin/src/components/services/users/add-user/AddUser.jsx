import { useContext, useState } from 'react';
import { AuthContext } from '../../../../context/AuthContext';

import Warning from '../../../warning/Warning';
import { errMsg, BASE_URL } from '../../utils';

import '../UserForm.css';

export default function AddUser() {
    const { isAuthenticated, admin } = useContext(AuthContext);
    const [userDetails, setUserDetails] = useState({
        name: '',
        email: '',
        password: '',
        role: 'operator',
    });
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);
    const [loading, setLoading] = useState(false);

    const changeHandler = (e) => {
        setUserDetails({
            ...userDetails,
            [e.target.name]: e.target.value,
        });
    };

    const clearForm = () => {
        setUserDetails({
            name: '',
            email: '',
            password: '',
            role: 'operator',
        });
    };

    const addUser = async (e) => {
        e.preventDefault();

        setLoading(true);
        setError(null);
        setSuccessMessage(null);

        try {
            const response = await fetch(`${BASE_URL}/admin-user-create`, {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    'auth-token': localStorage.getItem('auth-token'),
                },
                body: JSON.stringify(userDetails),
            });

            if (!response.ok) {
                if (response.status === 401) {
                    setError('Session expired. Please login again.');
                    return;
                }
                const errorData = await response.json();
                throw new Error(errorData.message || errMsg.createUser || 'Failed to create user');
            }

            const result = await response.json();

            if (result.success) {
                setSuccessMessage('User added successfully!');
                clearForm();
            } else {
                throw new Error(result.message || errMsg.createUser);
            }
        } catch (err) {
            setError(err.message || errMsg.unexpected);
        } finally {
            setLoading(false);
        }
    };

    // Only superadmin and admin can create users
    if (admin && admin.role === 'operator') {
        return (
            <>
                {!isAuthenticated 
                    ? <Warning />
                    : (
                        <div className="user-form-restricted">
                            <p className="error-message">You do not have permission to manage users. Only admins can manage users.</p>
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
                    <form className="user-form" onSubmit={addUser}>
                        <h2>Add New User</h2>
                        
                        {error && <p className="error-message">{error}</p>}
                        {successMessage && <p className="success-message">{successMessage}</p>}

                        <div className="user-itemfield">
                            <p>Name</p>
                            <input
                                value={userDetails.name}
                                onChange={changeHandler}
                                type="text"
                                name="name"
                                placeholder="Enter full name..."
                                required
                            />
                        </div>

                        <div className="user-itemfield">
                            <p>Email</p>
                            <input
                                value={userDetails.email}
                                onChange={changeHandler}
                                type="email"
                                name="email"
                                placeholder="Enter email address..."
                                required
                            />
                        </div>

                        <div className="user-itemfield">
                            <p>Password</p>
                            <input
                                value={userDetails.password}
                                onChange={changeHandler}
                                type="password"
                                name="password"
                                placeholder="Enter password..."
                                required
                            />
                        </div>

                        <div className="user-itemfield">
                            <p>Role</p>
                            <select
                                value={userDetails.role}
                                onChange={changeHandler}
                                name="role"
                                className="user-selector"
                            >
                                {admin && admin.role === 'superadmin' && (
                                    <option value="superadmin">Super Admin</option>
                                )}
                                <option value="admin">Admin</option>
                                <option value="operator">Operator</option>
                            </select>
                        </div>

                        <button type="submit" className="user-btn" disabled={loading}>
                            {loading ? 'Adding...' : 'Add User'}
                        </button>
                    </form>
                )
            }
        </>
    );
}
