import express from 'express';
import config from 'config';

const apiPrefix = config.get<string>('apiPrefix');
const version = config.get<string>('version');

const router = express.Router();

router.get(`/${apiPrefix}/${version}/user`, (_, res) => {
  res.sendStatus(200);
});

export default router;
