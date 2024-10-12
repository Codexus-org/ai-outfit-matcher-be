import express from 'express';
import cookieParser from 'cookie-parser';
import { dbConnect } from './utils/db-connection/db.connect';
import dotenv from 'dotenv';
import { userRouter } from './router/user.route';
import { getOutfit } from './services/get-outfit';
import { outfitRouter } from './router/outfit.route';
import cors from 'cors';

dotenv.config();

const app = express();
dbConnect();

app.use(
  cors({
     origin: "http://103.217.145.247/:5173",
     credentials: true,
  }),
);

app.use(express.json());
app.use(cookieParser());

app.post('/outfitmatcher', async (req, res) => {
    const { outfit } = req.body;

    //?fetching API
    const result = await getOutfit(outfit);

    return res.json({ result });
});


app.use('/outfitmatcher/api/v1/', userRouter);
app.use('/outfitmatcher/api/v1/outfit', outfitRouter);

app.listen(process.env.PORT, () => {
    console.log(`Server started on port ${process.env.PORT}`);
});