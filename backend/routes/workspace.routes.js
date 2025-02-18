import express from 'express';
import { verifyToken, verifySuperAdmin } from '../middlewares/auth.middleware.js';
import { 
    listWorkspaces,
    updateWorkspaceMessages
} from '../controllers/workspace.controller.js';

const router = express.Router();

router.use(verifyToken);
router.use(verifySuperAdmin);

router.get('/list', listWorkspaces);
router.put('/:id/messages', updateWorkspaceMessages);

export default router; 