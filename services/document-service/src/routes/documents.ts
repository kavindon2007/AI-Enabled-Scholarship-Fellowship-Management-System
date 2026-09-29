// Layer: Routes
// Responsibility: Map endpoints to controller methods and attach middlewares

import { Router } from 'express';
import { DocumentController } from '../controllers/documentController.js';
import { upload } from '../middleware/upload.js';

const router = Router();
const controller = new DocumentController();

// Create new document (multipart/form-data)
router.post('/upload', upload.single('file'), controller.upload.bind(controller));

// Get document metadata
router.get('/:id', controller.getInfo.bind(controller));

// Download actual file
router.get('/:id/download', controller.download.bind(controller));

export default router;
