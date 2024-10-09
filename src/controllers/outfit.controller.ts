import { Request, Response } from 'express';
import { getOutfit } from '../services/get-outfit';
import { Outfit } from '../models/outfit.schema';
import jwt from 'jsonwebtoken';

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
            const { accessToken } = req.cookies;

            // Cek apakah accessToken ada
            if (!accessToken) {
                return res.status(401).json({ message: 'Unauthorized: You must be logged in to create an outfit' });
            }

            // Verifikasi accessToken
            const payload = jwt.verify(accessToken, process.env.JWT_ACCESS_SECRET as string) as {
                id: string;
                firstName: string;
                lastName: string;
                username: string;
                email: string;
            };

            const { outfit } = req.body;

            console.log(outfit)

            // Generate outfit using AI
            const generatedOutfit = await getOutfit(outfit);

            // Create new Outfit instance
            const newOutfit = new Outfit(generatedOutfit);

            // Save to database
            await newOutfit.save();

            return res.status(201).json({ message: 'Outfit berhasil dibuat', data: newOutfit });
        } catch (error) {
            if (error instanceof jwt.JsonWebTokenError) {
                // Jika token tidak valid
                return res.status(401).json({ message: 'Unauthorized: Invalid token' });
            }
            // Jika terjadi error lain
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
