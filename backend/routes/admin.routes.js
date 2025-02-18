import express from 'express';
import { isAuthenticate } from '../middleware/verifyToken.js';
import { isSuperAdmin } from '../middleware/isSuperAdmin.js';

const router = express.Router();

router.get('/admin-only', isAuthenticate, isSuperAdmin, (req, res) => {
    res.json({ message: "Rota acessível apenas para super administradores" });
}); 