// backend/src/routers/auth.router.js
import express from 'express';
import {login } from '../controllers/login/auth.controller.js';

const router = express.Router();

router.post('/login', login);

export default router;
