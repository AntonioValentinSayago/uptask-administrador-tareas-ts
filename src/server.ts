import express from 'express';
import dotenv from 'dotenv';
import { connectDB } from './config/db';
import projectRoutes from './routes/projectRoutes';

dotenv.config();

// Conexion a la base de datos
connectDB();
const app = express();

app.use(express.json());

// routes
app.use('/api/projects', projectRoutes);

export default app;