require('dotenv').config();
import express from 'express';
import config from 'config';
import connectDB from './utils/connectdb';
import log from './utils/logger';

import router from './routes/index';

const port = config.get<number>('port');
const dbUri = config.get<string>('dbUri');
const app = express();

app.use(router);

app.listen(port, () => {
  log.info(`App started at http://localhost:${port}`);
  connectDB(dbUri);
});
