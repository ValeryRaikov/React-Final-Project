import express from 'express';
import Office from '../models/Office.js';
import * as c from '../controllers/officeController.js';

const router = express.Router();

router.get('/offices', c.getOffices);

export default router;