import express from 'express';
import config from 'config';
import { StatusCodes } from 'http-status-codes';
import authroutes from './auth.routes';
import userroutes from './user.routes';

const apiPrefix = config.get<string>('apiPrefix');
const version = config.get<string>('version');
const router = express.Router();

router.get(`/${apiPrefix}/${version}/healthcheck`, (_, res) => {
  res.sendStatus(StatusCodes.OK);
});

router.use(authroutes);
router.use(userroutes);

export default router;
