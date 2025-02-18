import db from '../models/index.js';
import bcrypt from 'bcrypt';
import { logger } from '../utils/logger.js';

const { User, Workspace, UserWorkspace } = db;

export const listUsers = async (req, res) => {
    try {
        const users = await User.findAll({
            include: [{
                model: Workspace,
                as: 'workspaces',
                through: {
                    model: UserWorkspace,
                    attributes: ['role']
                }
            }]
        });
        return res.json(users);
    } catch (error) {
        console.error('Erro ao listar usuários:', error);
        return res.status(500).json({ message: 'Erro interno do servidor' });
    }
};

export const getUserDetails = async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id, {
            include: [{
                model: Workspace,
                as: 'workspaces',
                through: { attributes: ['role'] }
            }],
            attributes: { exclude: ['password'] }
        });

        if (!user) {
            return res.status(404).json({ message: 'Usuário não encontrado' });
        }

        res.json(user);
    } catch (error) {
        logger.error('Erro ao buscar detalhes do usuário:', error);
        res.status(500).json({ message: 'Erro ao buscar detalhes do usuário' });
    }
};

export const createUser = async (req, res) => {
    try {
        const {
            email,
            username,
            password,
            cpf,
            gender,
            superAdmin,
            workspaceId,
            role
        } = req.body;

        // Verificar se o email já existe
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ message: 'Email já cadastrado' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            email,
            username,
            password: hashedPassword,
            cpf,
            gender,
            superAdmin: superAdmin || false
        });

        // Se não for superadmin, vincular a um workspace
        if (!superAdmin && workspaceId) {
            await UserWorkspace.create({
                userId: user.id,
                workspaceId,
                role: role || 'user'
            });

            // Definir workspace ativo
            await user.update({ activeWorkspaceId: workspaceId });
        }

        res.status(201).json({
            message: 'Usuário criado com sucesso',
            user: {
                id: user.id,
                email: user.email,
                username: user.username,
                superAdmin: user.superAdmin
            }
        });
    } catch (error) {
        logger.error('Erro ao criar usuário:', error);
        res.status(500).json({ message: 'Erro ao criar usuário' });
    }
};

export const updateUser = async (req, res) => {
    try {
        const {
            email,
            username,
            password,
            cpf,
            gender,
            superAdmin,
            workspaceId,
            role
        } = req.body;

        const user = await User.findByPk(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'Usuário não encontrado' });
        }

        // Atualizar dados básicos
        const updateData = {
            email,
            username,
            cpf,
            gender,
            superAdmin
        };

        // Se senha foi fornecida, atualizar
        if (password) {
            updateData.password = await bcrypt.hash(password, 10);
        }

        await user.update(updateData);

        // Atualizar workspace se fornecido
        if (workspaceId) {
            const userWorkspace = await UserWorkspace.findOne({
                where: { userId: user.id }
            });

            if (userWorkspace) {
                await userWorkspace.update({ workspaceId, role });
            } else {
                await UserWorkspace.create({
                    userId: user.id,
                    workspaceId,
                    role
                });
            }

            await user.update({ activeWorkspaceId: workspaceId });
        }

        res.json({
            message: 'Usuário atualizado com sucesso',
            user: {
                id: user.id,
                email: user.email,
                username: user.username,
                superAdmin: user.superAdmin
            }
        });
    } catch (error) {
        logger.error('Erro ao atualizar usuário:', error);
        res.status(500).json({ message: 'Erro ao atualizar usuário' });
    }
};

export const toggleUserStatus = async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'Usuário não encontrado' });
        }

        await user.update({ isActive: !user.isActive });

        res.json({
            message: `Usuário ${user.isActive ? 'ativado' : 'desativado'} com sucesso`,
            isActive: user.isActive
        });
    } catch (error) {
        logger.error('Erro ao alterar status do usuário:', error);
        res.status(500).json({ message: 'Erro ao alterar status do usuário' });
    }
}; 