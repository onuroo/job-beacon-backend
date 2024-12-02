import express from 'express';
import { app as firebaseApp } from './config/firebase';
import authRoutes from './routes/auth';

const app = express();
app.use(express.json());

// Auth rotalarını ekle
app.use('/auth', authRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
