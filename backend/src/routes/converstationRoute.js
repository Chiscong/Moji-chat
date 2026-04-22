import express from 'express';
import { createConverstation, getConverstation, getMessage, markAsSeen } from '../controllers/converstationController.js'
import { checkFriendship } from '../middlewares/friendMiddeware.js';
const router = express.Router();

router.post('/', checkFriendship, createConverstation);
router.get('/', getConverstation);
router.get('/:converstationId/messages', getMessage);
router.patch("/:converstationId/seen", markAsSeen)
export default router;