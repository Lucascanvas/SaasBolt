import express from "express";
import { isAuthenticate } from "../middleware/verifyToken.js"
import { 
    getUsers, 
    getUserForSidebar, 
    createUser, 
    updateUser, 
    setActiveWorkspace, 
    getUserWorkspaces, 
    getActiveWorkspace, 
    getUserDetails,
    listUsers,
    toggleUserStatus
} from "../controllers/user.controller.js"
import { verifyToken, verifySuperAdmin } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.get("/workspace/:workspaceId", isAuthenticate, getUsers);
router.get("/sidebar", isAuthenticate, getUserForSidebar);
router.post("/", isAuthenticate, createUser);
router.put("/", isAuthenticate, updateUser);
router.put("/active-workspace", isAuthenticate, setActiveWorkspace);
router.get("/workspaces", isAuthenticate, getUserWorkspaces);
router.get("/active-workspace", isAuthenticate, getActiveWorkspace);
router.get("/me", isAuthenticate, getUserDetails);

// Rotas protegidas que requerem autenticação e permissão de superadmin
router.get('/list', verifyToken, verifySuperAdmin, listUsers);
router.put('/update/:id', verifyToken, verifySuperAdmin, updateUser);
router.patch('/toggle-status/:id', verifyToken, verifySuperAdmin, toggleUserStatus);

export default router;
