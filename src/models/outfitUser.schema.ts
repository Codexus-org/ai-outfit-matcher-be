import mongoose, { Schema, Document } from 'mongoose';

export interface IOutfitUser extends Document {
    user_id: string;
    name: string;
    weatherCategory: string;
    occasionCategory: string;
    clothes: string;
    pants: string;
    shoe: string;
    description: string;
    imageOutfit: string;
}

const OutfitUserSchema: Schema = new Schema({
    user_id: { type: String, required: true },
    name: { type: String, required: true },
    weatherCategory: { type: String, required: true },
    occasionCategory: { type: String, required: true },
    clothes: { type: String, required: true },
    pants: { type: String, required: true },
    shoe: { type: String, required: true },
    description: { type: String, required: true },
    imageOutfit: { type: String, required: true },
});

export const OutfitUser = mongoose.model<IOutfitUser>('OutfitUser', OutfitUserSchema);
