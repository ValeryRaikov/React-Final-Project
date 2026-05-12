// controllers/officeController.js - Controller for handling office-related API requests, including fetching office data from the database

import Office from '../models/Office.js';

// Fetch all offices from the database and return as JSON response
export const getOffices = async (req, res) => {
    try {
        const offices = await Office.find();

        res.json({
            success: true,
            data: offices,
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: 'Failed to fetch offices',
        });
    }
}