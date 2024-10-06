import express from 'express';
import OutfitController from '../controllers/outfit.controller';

export const outfitRouter = express.Router();

outfitRouter.post('/', OutfitController.handleCreateOutfit);
outfitRouter.get('/', OutfitController.handleGetAllOutfit);
outfitRouter.delete('/:id', OutfitController.handleDeleteOutfit);
