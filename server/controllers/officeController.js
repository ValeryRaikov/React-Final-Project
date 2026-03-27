import Office from '../models/Office.js';

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