// backend/src/routers/auth.router.js
import express from 'express';
import {login } from '../controllers/UserAccount/login.controller.js';

const router = express.Router();

router.post('/', login);

export default router;
