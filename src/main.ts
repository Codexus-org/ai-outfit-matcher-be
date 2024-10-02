import express from 'express';
import { dbConnect } from './utils/db-connection/db.connect';
import dotenv from 'dotenv';
dotenv.config();

const app = express();
dbConnect();

app.use(express.json());

app.get('/', (req, res) => {
    return res.send('Hello World!');
});

app.listen(process.env.PORT, () => {
    console.log(`Server started on port ${process.env.PORT}`);
});