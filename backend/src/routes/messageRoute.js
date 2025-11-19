import express from 'express';
import {checkFriendship ,checkGroupMembership} from '../middlewares/friendMiddeware.js';
import {
    sendDirectMessage,
    sendGroupMessage
} from '../controllers/messageController.js';
const router = express.Router();
router.post('/direct',checkFriendship, sendDirectMessage);
router.post('/group',checkGroupMembership, sendGroupMessage);
export default router;