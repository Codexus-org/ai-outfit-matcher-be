import express from 'express';
import cookiParser from 'cookie-parser';
import { dbConnect } from './utils/db-connection/db.connect';
import dotenv from 'dotenv';
import { userRouter } from './router/user.route';
dotenv.config();

const app = express();
dbConnect();

app.use(express.json());
app.use(cookiParser());

app.get('/', (req, res) => {
    return res.send('Hello World!');
});

app.use("/outfitmatcher/api/v1/", userRouter);

app.listen(process.env.PORT, () => {
    console.log(`Server started on port ${process.env.PORT}`);
});