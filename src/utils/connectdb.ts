import mongoose from 'mongoose';
import config from 'config';
import log from './logger';

async function connectDB(uri: string) {
  try {
    await mongoose.connect(uri);
    log.info(`Connected to DB`);
  } catch (error) {
    process.exit(1);
  }
}

export default connectDB;
