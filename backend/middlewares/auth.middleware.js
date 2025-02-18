import jwt from 'jsonwebtoken';
import { errorHandler } from '../utils/error.js';
import models from '../models/index.js';

const { User } = models;

export const verifyToken = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        
        if (!token) {
            return next(errorHandler(401, 'Token não fornecido'));
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findByPk(decoded.id);

        if (!user) {
            return next(errorHandler(401, 'Usuário não encontrado'));
        }

        req.user = user;
        next();
    } catch (error) {
        return next(errorHandler(401, 'Token inválido'));
    }
};

export const verifySuperAdmin = (req, res, next) => {
    if (!req.user.superAdmin) {
        return next(errorHandler(403, 'Acesso negado. Apenas super administradores podem acessar este recurso'));
    }
    next();
}; 