import express from 'express';
import ChatbotController from '../controllers/chatbotController.js';

const router = express.Router();

router.post('/query', ChatbotController.query);

export default router;
