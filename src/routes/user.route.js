import express from 'express';
import trimRequest from 'trim-request';
import { searchUser } from '../controllers/user.controller.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const router = express.Router();

router.route('/').get(trimRequest.all, authMiddleware, searchUser);

export default router;
