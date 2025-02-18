import { errorHandler } from "../utils/error.js";
import models from '../models/index.js';

const { User } = models;

export const isSuperAdmin = async (req, res, next) => {
    try {
        const user = await User.findByPk(req.user.id);
        
        if (!user || !user.superAdmin) {
            return next(errorHandler(403, "Acesso negado. Apenas super administradores podem acessar este recurso."));
        }
        
        next();
    } catch (error) {
        next(errorHandler(500, "Erro ao verificar permissões de super administrador"));
    }
}; 