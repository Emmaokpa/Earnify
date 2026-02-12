import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

import routes from './routes';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use('/api', routes);

app.get('/', (req: Request, res: Response) => {
    res.json({ message: 'Welcome to Earnify API' });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
