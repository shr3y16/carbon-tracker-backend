import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import authRoutes from './routes/auth';
import activityRoutes from './routes/activity';
import healthRoutes from './routes/health';

dotenv.config();

const app = express();
const frontendURL = process.env.FRONTEND_URL || "http://localhost:5173";

app.use( cors({
    origin: frontendURL,
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
    methods: ["GET", "POST", "PATCH", "DELETE"],
  }));
app.use(express.json());

app.use('/auth', authRoutes);
app.use('/activity', activityRoutes);
app.use('/health', healthRoutes);

app.get('/', (req, res) => {
    res.send('Welcome to the API!');
});

export default app;
