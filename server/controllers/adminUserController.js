import Admin from '../models/Admin.js';
import { isValidEmail, isValidPassword } from '../utils/validators.js';

// Create a new admin/operator
const addUser = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;
        const currentUserRole = req.user?.role;

        // Validate input
        if (!name || !email || !password || !role) {
            return res.status(400).json({
                success: false,
                message: 'Name, email, password, and role are required'
            });
        }

        // Validate email and password format
        if (!isValidEmail(email)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid email format'
            });
        }

        if (!isValidPassword(password)) {
            return res.status(400).json({
                success: false,
                message: 'Password must be at least 8 chars, include uppercase, lowercase, number, and special character'
            });
        }

        // Check if email already exists
        const existingUser = await Admin.findOne({ email: email.toLowerCase().trim() });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'Email already registered'
            });
        }

        // Permission checks
        if (currentUserRole === 'operator') {
            return res.status(403).json({
                success: false,
                message: 'Operators cannot create users'
            });
        }

        // Only superadmin can create other superadmins
        if (role === 'superadmin' && currentUserRole !== 'superadmin') {
            return res.status(403).json({
                success: false,
                message: 'Only superadmin can create superadmin accounts'
            });
        }

        // Create new user
        const newUser = new Admin({
            name: name.trim(),
            email: email.toLowerCase().trim(),
            password,
            role,
            isActive: true
        });

        await newUser.save();

        res.json({
            success: true,
            message: 'User created successfully',
            user: {
                id: newUser._id,
                name: newUser.name,
                email: newUser.email,
                role: newUser.role,
                isActive: newUser.isActive
            }
        });
    } catch (err) {
        console.error('Add user error:', err);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// Get all users (admins and operators)
const getAllUsers = async (req, res) => {
    try {
        const currentUserRole = req.user?.role;

        // Operators cannot view users
        if (currentUserRole === 'operator') {
            return res.status(403).json({
                success: false,
                message: 'Operators cannot view users'
            });
        }

        const users = await Admin.find({}, '-password').sort({ date: -1 });

        res.json({
            success: true,
            data: users.map(u => ({
                _id: u._id,
                name: u.name,
                email: u.email,
                role: u.role,
                isActive: u.isActive,
                date: u.date
            }))
        });
    } catch (err) {
        console.error('Get all users error:', err);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// Get a single user by ID
const getUser = async (req, res) => {
    try {
        const user = await Admin.findById(req.params.id, '-password');

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        res.json({
            success: true,
            data: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                isActive: user.isActive,
                date: user.date
            }
        });
    } catch (err) {
        console.error('Get user error:', err);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// Update a user
const updateUser = async (req, res) => {
    try {
        const userId = req.params.id;
        const { name, email, role, isActive, password } = req.body;
        const currentUserRole = req.user?.role;
        const currentUserId = req.user?.id;

        // Find the user to update
        const userToUpdate = await Admin.findById(userId);
        if (!userToUpdate) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Permission checks
        if (currentUserRole === 'operator') {
            return res.status(403).json({
                success: false,
                message: 'Operators cannot edit users'
            });
        }

        // Cannot edit superadmin if not superadmin
        if (userToUpdate.role === 'superadmin' && currentUserRole !== 'superadmin') {
            return res.status(403).json({
                success: false,
                message: 'You cannot edit a superadmin'
            });
        }

        // Cannot change anyone to superadmin if not superadmin
        if (role === 'superadmin' && currentUserRole !== 'superadmin') {
            return res.status(403).json({
                success: false,
                message: 'Only superadmin can change role to superadmin'
            });
        }

        // Update fields
        if (name) userToUpdate.name = name.trim();
        if (email) {
            if (!isValidEmail(email)) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid email format'
                });
            }

            // Check if email is already in use by another user
            const existingUser = await Admin.findOne({
                email: email.toLowerCase().trim(),
                _id: { $ne: userId }
            });

            if (existingUser) {
                return res.status(400).json({
                    success: false,
                    message: 'Email already in use'
                });
            }

            userToUpdate.email = email.toLowerCase().trim();
        }

        if (password) {
            if (!isValidPassword(password)) {
                return res.status(400).json({
                    success: false,
                    message: 'Password must be at least 8 chars, include uppercase, lowercase, number, and special character'
                });
            }
            userToUpdate.password = password;
        }

        if (role) userToUpdate.role = role;
        if (isActive !== undefined) userToUpdate.isActive = isActive;

        await userToUpdate.save();

        res.json({
            success: true,
            message: 'User updated successfully',
            user: {
                id: userToUpdate._id,
                name: userToUpdate.name,
                email: userToUpdate.email,
                role: userToUpdate.role,
                isActive: userToUpdate.isActive
            }
        });
    } catch (err) {
        console.error('Update user error:', err);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// Delete a user
const deleteUser = async (req, res) => {
    try {
        const userId = req.params.id;
        const currentUserRole = req.user?.role;
        const currentUserId = req.user?.id;

        // Cannot delete self
        if (userId === currentUserId) {
            return res.status(400).json({
                success: false,
                message: 'You cannot delete your own account'
            });
        }

        // Find the user to delete
        const userToDelete = await Admin.findById(userId);
        if (!userToDelete) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Permission checks
        if (currentUserRole === 'operator') {
            return res.status(403).json({
                success: false,
                message: 'Operators cannot delete users'
            });
        }

        // Cannot delete superadmin if not superadmin
        if (userToDelete.role === 'superadmin' && currentUserRole !== 'superadmin') {
            return res.status(403).json({
                success: false,
                message: 'You cannot delete a superadmin'
            });
        }

        // Check if there's at least one other superadmin
        if (userToDelete.role === 'superadmin') {
            const superadminCount = await Admin.countDocuments({ role: 'superadmin' });
            if (superadminCount <= 1) {
                return res.status(400).json({
                    success: false,
                    message: 'Cannot delete the only superadmin'
                });
            }
        }

        await Admin.findByIdAndDelete(userId);

        res.json({
            success: true,
            message: 'User deleted successfully'
        });
    } catch (err) {
        console.error('Delete user error:', err);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

export { addUser, getAllUsers, getUser, updateUser, deleteUser };
