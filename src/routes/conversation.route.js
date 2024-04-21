import express from 'express';
import trimRequest from 'trim-request';
import {
	createGroup,
	create_open_conversation,
	getConversations,
} from '../controllers/conversation.controller.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const router = express.Router();

router.route('/').post(trimRequest.all, authMiddleware, create_open_conversation);
router.route('/').get(trimRequest.all, authMiddleware, getConversations);
router.route('/group').get(trimRequest.all, authMiddleware, createGroup);

export default router;
