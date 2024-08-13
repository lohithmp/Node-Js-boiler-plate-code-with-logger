import express from 'express';
import dotenv from 'dotenv';
import { logger } from './utils/logger';
import authRoutes from './routes/authRoutes';
import connectToDatabase from './config/dbConnect';


dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

connectToDatabase().then(() => {
  app.use(express.json());
  
  app.use('/api/auth', authRoutes);

  app.listen(PORT, () => {
    logger.info(`Server running on port ${PORT}`);
  });
});
