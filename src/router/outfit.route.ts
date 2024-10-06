import express from 'express';
import OutfitController from '../controllers/outfit.controller';
import authMiddleware from '../middleware/auth.middleware';

export const outfitRouter = express.Router();

// outfitRouter.use(authMiddleware);

outfitRouter.post('/', authMiddleware, OutfitController.handleCreateOutfit);
outfitRouter.get('/', authMiddleware, OutfitController.handleGetAllOutfit);
outfitRouter.delete('/:id', authMiddleware, OutfitController.handleDeleteOutfit);
