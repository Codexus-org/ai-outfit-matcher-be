import { Schema, model } from "mongoose";

const sharepicSchema = new Schema(
    {
        userId: { type: Schema.Types.ObjectId, ref: "User" },
        outfitId: { type: Schema.Types.ObjectId, ref: "Outfit" },
        createAt: { type: Date, default: Date.now },
        updateAt: { type: Date, default: Date.now },
        rating: { type: Number },
    },
    { versionKey: false },
);

export const SharePic = model("SharePic", sharepicSchema);