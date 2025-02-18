import models from '../models/index.js';
import { errorHandler } from '../utils/error.js';

const { Workspace } = models;

// Listar todas as empresas com paginação
export const listWorkspaces = async (req, res, next) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const offset = (page - 1) * limit;

        const { count, rows: workspaces } = await Workspace.findAndCountAll({
            attributes: [
                'id', 
                'name', 
                'cnpj', 
                'availableMessages',
                'messagesExpiration',
                'createdAt',
                'updatedAt'
            ],
            limit,
            offset,
            order: [['createdAt', 'DESC']]
        });

        res.json({
            workspaces,
            pagination: {
                total: count,
                pages: Math.ceil(count / limit),
                currentPage: page,
                perPage: limit
            }
        });
    } catch (error) {
        next(errorHandler(500, error.message));
    }
};

// Atualizar mensagens disponíveis
export const updateWorkspaceMessages = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { availableMessages, messagesExpiration } = req.body;

        const workspace = await Workspace.findByPk(id);
        if (!workspace) {
            return next(errorHandler(404, "Empresa não encontrada"));
        }

        await workspace.update({
            availableMessages,
            messagesExpiration: messagesExpiration ? new Date(messagesExpiration) : null
        });

        res.json({
            message: "Mensagens atualizadas com sucesso",
            workspace: {
                id: workspace.id,
                name: workspace.name,
                availableMessages: workspace.availableMessages,
                messagesExpiration: workspace.messagesExpiration
            }
        });
    } catch (error) {
        next(errorHandler(500, error.message));
    }
};

// Verificar e decrementar mensagens
export const checkAndDecrementMessages = async (workspaceId) => {
    try {
        const workspace = await Workspace.findByPk(workspaceId);
        
        if (!workspace) {
            throw new Error("Empresa não encontrada");
        }

        if (workspace.messagesExpiration && new Date() > workspace.messagesExpiration) {
            throw new Error("Mensagens expiradas");
        }

        if (workspace.availableMessages <= 0) {
            throw new Error("Sem mensagens disponíveis");
        }

        await workspace.decrement('availableMessages');
        await workspace.reload();

        return workspace;
    } catch (error) {
        throw error;
    }
}; 