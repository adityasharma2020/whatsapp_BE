import express from 'express';
import trimRequest from 'trim-request';
import { create_open_conversation } from '../controllers/conversation.controller.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const router = express.Router();

router.route('/').post(trimRequest.all, authMiddleware, create_open_conversation);

export default router;
