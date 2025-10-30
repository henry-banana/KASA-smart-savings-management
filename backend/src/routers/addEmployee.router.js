// backend/src/routers/addEmployee.router.js
import express from 'express';
import {addEmployee } from '../controllers/addEmployee/addEmployee.controller.js';

const router = express.Router();

router.post('/', addEmployee);

export default router;
