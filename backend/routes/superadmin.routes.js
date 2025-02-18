import express from 'express';
import { verifyToken, verifySuperAdmin } from '../middlewares/auth.middleware.js';
import { 
    createUser, 
    updateUser, 
    toggleUserStatus,
    listUsers,
    getUserDetails
} from '../controllers/superadmin.controller.js';

const router = express.Router();

// Todas as rotas precisam de autenticação e permissão de superadmin
router.use(verifyToken);
router.use(verifySuperAdmin);

// Listar todos os usuários
router.get('/users', listUsers);

// Obter detalhes de um usuário específico
router.get('/users/:id', getUserDetails);

// Criar novo usuário (superadmin ou usuário normal)
router.post('/users', createUser);

// Atualizar usuário
router.put('/users/:id', updateUser);

// Ativar/Desativar usuário
router.patch('/users/:id/toggle-status', toggleUserStatus);

export default router; 