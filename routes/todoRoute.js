// todo route.js

import express from 'express'
import protectRoute from '../middlewares/protectRoute.js';
import { addTask, completedTask, deleteTask, editProfile, editTask, getallTask, getTask } from '../Controllers/todoController.js';
const router = express.Router();

router.post('/editprofile', protectRoute , editProfile);
router.post('/addtask', protectRoute , addTask);
router.get('/alltask', protectRoute , getallTask);
router.delete('/deletetask/:id', protectRoute, deleteTask);
router.post('/completed-task/:id', protectRoute , completedTask);
router.get('/task/:id', protectRoute , getTask);
router.put('/edit-task/:id', protectRoute , editTask);

export default router