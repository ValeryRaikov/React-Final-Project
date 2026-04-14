import { errMsg, BASE_URL } from './utils';

const getAuthToken = () => localStorage.getItem('auth-token');

const handleResponse = async (response) => {
    if (response.status === 401) {
        throw new Error('Session expired. Please login again.');
    }

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Request failed');
    }

    return await response.json();
};

export const userServices = {
    // Get all users
    getAllUsers: async () => {
        try {
            const response = await fetch(`${BASE_URL}/admin-users`, {
                headers: {
                    'auth-token': getAuthToken(),
                },
            });
            return await handleResponse(response);
        } catch (err) {
            throw new Error(err.message || errMsg.fetchUsers);
        }
    },

    // Get single user by ID
    getUser: async (userId) => {
        try {
            const response = await fetch(`${BASE_URL}/admin-user/${userId}`, {
                headers: {
                    'auth-token': getAuthToken(),
                },
            });

            return await handleResponse(response);
        } catch (err) {
            throw new Error(err.message || errMsg.fetchUser);
        }
    },

    // Create new user
    createUser: async (userData) => {
        try {
            const response = await fetch(`${BASE_URL}/admin-user-create`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'auth-token': getAuthToken(),
                },
                body: JSON.stringify(userData),
            });

            return await handleResponse(response);
        } catch (err) {
            throw new Error(err.message || errMsg.createUser);
        }
    },

    // Update user
    updateUser: async (userId, userData) => {
        try {
            const response = await fetch(`${BASE_URL}/admin-user-update/${userId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'auth-token': getAuthToken(),
                },
                body: JSON.stringify(userData),
            });

            return await handleResponse(response);
        } catch (err) {
            throw new Error(err.message || errMsg.updateUser);
        }
    },

    // Delete user
    deleteUser: async (userId) => {
        try {
            const response = await fetch(`${BASE_URL}/admin-user-delete/${userId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'auth-token': getAuthToken(),
                },
            });
            
            return await handleResponse(response);
        } catch (err) {
            throw new Error(err.message || errMsg.deleteUser);
        }
    },
};
