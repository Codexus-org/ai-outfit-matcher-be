import { Request, Response } from 'express';
import { getOutfit } from '../services/get-outfit';
import { Outfit } from '../models/outfit.schema';

const OutfitController = {
    handleGetAllOutfit: async (req: Request, res: Response) => {
        try {
            const allOutfits = await Outfit.find();
            return res.status(200).json({ data: allOutfits });
        } catch (error) {
            return res.status(500).json({ message: 'Gagal mendapatkan outfit', error });
        }
    },

    handleCreateOutfit: async (req: Request, res: Response) => {
        try {
            const { outfit } = req.body;

            // Generate outfit using AI
            const generatedOutfit = await getOutfit(outfit);

            // Create new Outfit instance
            const newOutfit = new Outfit(generatedOutfit);

            // Save to database
            await newOutfit.save();

            return res.status(201).json({ message: 'Outfit berhasil dibuat', data: newOutfit });
        } catch (error) {
            return res.status(500).json({ message: 'Gagal membuat outfit', error });
        }
    },

    handleDeleteOutfit: async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            await Outfit.deleteOne({ _id: id });
            return res.status(200).json({ message: 'Outfit berhasil dihapus' });
        } catch (error) {
            return res.status(500).json({ message: 'Gagal menghapus outfit', error });
        }
    },
};

export default OutfitController;
