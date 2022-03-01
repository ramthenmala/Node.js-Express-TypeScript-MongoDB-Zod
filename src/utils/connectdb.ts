import mongoose from 'mongoose';
import config from 'config';
import log from './logger';

const connectDB = async () => {
  const dbUri = config.get<string>('dbUri');

  try {
    await mongoose.connect(dbUri);
    log.info(`connected mongoose`);
  } catch (error) {
    log.info(`Error from connectDB Ts`);
    log.info(error);
    process.exit(1);
  }
};

export default connectDB;
