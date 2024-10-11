import { Outfit } from '../models/outfit.schema';
import { OutfitUser } from '../models/outfitUser.schema';

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

    getByUserId: async (id: string) => {
      const user_id = id;
      const outfits = await OutfitUser.find({ user_id });

      return outfits;
    }
};

export default OutfitRepository;
