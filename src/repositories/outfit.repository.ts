import { Outfit } from '../models/outfit.schema';

const OutfitRepository = {
    getAll: async () => {
        try {
            const allOutfits = await Outfit.find();
            return allOutfits;
        } catch (error) {
            console.log(error);
            console.log('Failed get all outfits');
        }
    },
};

export default OutfitRepository;
