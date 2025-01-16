import express from 'express';
import petshopRoutes from './routes/routes';

const app = express();

app.use(express.json());
app.use(petshopRoutes);

export default app;
