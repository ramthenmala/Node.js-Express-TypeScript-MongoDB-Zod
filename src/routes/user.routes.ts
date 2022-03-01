import express, { Request, Response } from 'express';
import config from 'config';
import { StatusCodes } from 'http-status-codes';
import validateResource from '../middleware/validate.middleware';
import { createUserSchema } from '../schema/user.schema';
import { createUserHandler } from '../controller/user.controller';

const apiPrefix = config.get<string>('apiPrefix');
const version = config.get<string>('version');

const userRoutes = express.Router();

userRoutes.post(
  `/${apiPrefix}/${version}/users`,
  validateResource(createUserSchema),
  createUserHandler
);

export default userRoutes;
