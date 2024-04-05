/* 
  * we can define routes like router.post('/login',contollerfunction).
      but using router.route('/login').post(trimRequest.all, login)
      is more sophisticated way.
  * trimRequest.all to trim all the white spaces on the body,params and query objects from the requests.

*/

import express from 'express';
import trimRequest from 'trim-request';
import { login, logout, refreshToken, register } from '../controllers/auth.controller.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const router = express.Router();

router.route('/register').post(trimRequest.all, register);
router.route('/login').post(trimRequest.all, login);
router.route('/logout').post(trimRequest.all, logout);
router.route('/refreshtoken').post(trimRequest.all, refreshToken);
router.route('/testroute').get(trimRequest.all, authMiddleware, (req, res) => res.send('hello'));

export default router;
