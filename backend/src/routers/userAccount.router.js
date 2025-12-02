// backend/src/routers/auth.router.js
import express from 'express';
import {login } from '../controllers/UserAccount/login.controller.js';
import {getAllEmployees} from '../controllers/Employee/employee.controller.js';
import {createUserAccount, updateUserAccount} from '../controllers/UserAccount/userAccount.controller.js';



const router = express.Router();

router.post('/login', login);
router.post('/', createUserAccount)
router.get('/', getAllEmployees)
router.put('/:id', updateUserAccount)

export default router;
