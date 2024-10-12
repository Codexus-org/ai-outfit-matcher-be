import { Request, Response } from 'express';
import { deleteOutfitByUserId, getOutfit, getOutfitUser } from '../services/get-outfit';
import { Outfit } from '../models/outfit.schema';
import jwt from 'jsonwebtoken';
import { OutfitUser } from '../models/outfitUser.schema';

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
            if (error instanceof jwt.JsonWebTokenError) {
                // Jika token tidak valid
                return res.status(401).json({ message: 'Unauthorized: Invalid token' });
            }
            // Jika terjadi error lain
            return res.status(500).json({ message: 'Gagal membuat outfit', error });
        }
    },

    handleSaveOutfit: async (req: Request, res: Response) => {
        try {
            const { outfitId } = req.body;
            // Ambil userId, username dari local storage browser
            const userId = localStorage.getItem('userId');
            const username = localStorage.getItem('username');

            console.log(userId, username);
            // Cari outfit berdasarkan outfitId
            const outfit = await Outfit.findById(outfitId);
            if (!outfit) {
                return res.status(404).json({ message: 'Outfit not found' });
            }

            // Buat instance OutfitUser dengan data yang diperlukan
            const outfitUser = new OutfitUser({
                user_id: userId, // ID user dari token
                name: username || 'User', // Menangani kasus jika nama tidak ada // Nama user
                weatherCategory: outfit.weatherCategory, // Ambil dari outfit
                occasionCategory: outfit.occasionCategory, // Ambil dari outfit
                clothes: outfit.clothes, // Ambil dari outfit
                pants: outfit.pants, // Ambil dari outfit
                shoe: outfit.shoe, // Ambil dari outfit
                description: outfit.description, // Ambil dari outfit
                imageOutfit: outfit.imageOutfit, // Ambil dari outfit
            });

            // Simpan outfitUser ke database
            await outfitUser.save();

            return res.status(201).json({ message: 'Outfit berhasil disimpan', data: outfitUser });
        } catch (error) {
            return res.status(500).json({ message: 'Gagal menyimpan outfit', error });
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

    handleGetOutfitByUserId: async (req: Request, res: Response) => {
        try {
            const { userid } = req.params;

            const outfit = await getOutfitUser(userid);

            return res.status(200).json({ message: 'Success get outfit by user', data: outfit });
        } catch (error) {
            return res.status(500).json({ message: 'Failed get outfit by user', error });
        }
    },

    handleDeleteOutfitByUserId: async (req: Request, res: Response) => {
        try {
            const id = req.params.id;
            await deleteOutfitByUserId(id);
            return res.status(200).json({ message: 'success delete outfit' });
        } catch (error) {
            return res.status(500).json({ message: 'Failed delete outfit by user', error });
        }
    },
};

export default OutfitController;
