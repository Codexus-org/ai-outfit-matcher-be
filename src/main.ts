import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

mongoose
    .connect(process.env.MONGO_URI as string)
    .then(() => {
        console.log('Connected to MongoDB');
    })
    .catch(() => {
        console.log('Failed to connect to MongoDB');
    });

const app = express();

app.get('/', (req, res) => {
    return res.send('Hello World!');
});

app.listen(8000, () => console.log('Server running on port 8000'));
