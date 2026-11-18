import express from 'express';
import {
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  updateTaskStatus,
  deleteTask,
  addAttachment,
  deleteAttachment,
} from '../controllers/taskController.js';
import { protect } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';

const router = express.Router();

router.use(protect); // All task routes require authentication

router
  .route('/')
  .get(getTasks)
  .post(upload.array('attachments', 5), createTask);

router
  .route('/:id')
  .get(getTaskById)
  .put(updateTask)
  .delete(deleteTask);

router.patch('/:id/status', updateTaskStatus);

router
  .route('/:id/attachments')
  .post(upload.array('attachments', 5), addAttachment);

router.delete('/:id/attachments/:attachmentId', deleteAttachment);

export default router;
