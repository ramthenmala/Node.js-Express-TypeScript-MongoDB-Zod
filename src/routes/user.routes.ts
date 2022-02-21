import express from 'express';
import config from 'config';
import validateResource from '../middleware/validateResource.middleware';
import { createUserSchema } from '../schema/user.schema';
import { createUserHandler } from '../contorller/user.controller';

const apiPrefix = config.get<string>('apiPrefix');
const version = config.get<string>('version');

const router = express.Router();

router.get(
  `/${apiPrefix}/${version}/user`,
  validateResource(createUserSchema),
  createUserHandler
);

export default router;
