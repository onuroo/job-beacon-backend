import express from 'express';
import cvRoutes from './routes/cv';

const app = express();

app.use('/api/cv', cvRoutes);

export default app; 