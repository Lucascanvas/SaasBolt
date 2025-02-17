import express from 'express';
import { 
    createCampaign, 
    getCampaigns, 
    getCampaignById, 
    updateCampaign, 
    deleteCampaign,
    getCampaignStats
} from '../controllers/campaign.controller.js';
import { checkMinioConnection } from '../middlewares/minioCheck.js';

const router = express.Router();

router.get('/:workspaceId/stats', getCampaignStats);
router.post('/:workspaceId', checkMinioConnection, createCampaign);
router.get('/:workspaceId', getCampaigns);
router.get('/:workspaceId/:id', getCampaignById);
router.put('/:workspaceId/:id', updateCampaign);
router.delete('/:workspaceId/:campaignId', deleteCampaign);

export default router;
