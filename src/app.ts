import dotenv from 'dotenv';
import express from 'express';
import config from 'config';
import connectDB from './utils/connectDB';
import log from './utils/logger';
import router from './routes';
dotenv.config();
const app = express();
const port = config.get<number>('port');

app.use(router);
app.use(express.json());

app.listen(port, () => {
  log.info(`app started at http://localhost:${port}`);
  connectDB();
});
