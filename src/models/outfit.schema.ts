import { model, Schema } from 'mongoose';

//* Schema
const outfitSchema = new Schema({
    weatherCategory: String,
    occasionCategory: String,
    clothes: String,
    pants: String,
    shoe: String,
    description: String,
    imageOutfit: String,
});

//* create collection
export const Outfit = model('Outfit', outfitSchema);
