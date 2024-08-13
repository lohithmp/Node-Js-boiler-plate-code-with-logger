import mongoose from 'mongoose';
import { logger } from '../utils/logger';

const connectToDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/userdb');
    logger.info('MongoDB connected');
  } catch (err) {
    logger.error('MongoDB connection error:', err);
  }
};

export default connectToDatabase;
