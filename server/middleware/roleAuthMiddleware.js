export const requireRole = (allowedRoles) => {
    return (req, res, next) => {
        const userRole = req.user?.role;

        if (!userRole || !allowedRoles.includes(userRole)) {
            return res.status(403).json({
                success: false,
                message: 'You do not have permission to perform this action'
            });
        }

        next();
    };
};

export const canManageUser = (req, res, next) => {
    const currentUserRole = req.user?.role;
    const targetUserId = req.params.id;

    // Superadmin can do everything
    if (currentUserRole === 'superadmin') {
        return next();
    }

    // Admin can manage admins and operators, but not superadmin
    if (currentUserRole === 'admin') {
        // Check if trying to access superadmin
        // This will be done in the controller
        return next();
    }

    // Operators cannot manage users
    return res.status(403).json({
        success: false,
        message: 'Operators cannot manage users'
    });
};
