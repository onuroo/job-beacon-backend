import express from 'express';
import { app as firebaseApp } from './config/firebase';
import authRoutes from './routes/auth';
import cvRoutes from './routes/cv';

const app = express();
app.use(express.json());

// Auth rotalarını ekle
app.use('/auth', authRoutes);
app.use('/api/cv', cvRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
