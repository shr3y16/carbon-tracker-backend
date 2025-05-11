import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import authRoutes from './routes/auth';
import footprintRoutes from './routes/footprint';
import activityRoutes from './routes/activity';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use('/auth', authRoutes);
app.use('/footprint', footprintRoutes);
app.use('/activity', activityRoutes);

app.get('/', (req, res) => {
    res.send('Welcome to the API!');
});

export default app;
