import express, { application } from 'express';
import config from 'config';
import { StatusCodes } from 'http-status-codes';

import authRoutes from './auth.routes';
import userRoutes from './user.routes';

const apiPrefix = config.get<string>('apiPrefix');
const version = config.get<string>('version');

const router = express.Router();

router.get(`/${apiPrefix}/${version}/healthcheck`, (_, res) => {
  res.sendStatus(StatusCodes.OK);
});

router.use(authRoutes);
router.use(userRoutes);

export default router;
