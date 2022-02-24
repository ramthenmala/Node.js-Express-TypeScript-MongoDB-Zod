import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { createUserInput } from '../schema/user.schema';

export async function createUserHandler(
  req: Request<{}, {}, createUserInput>,
  res: Response
) {
  const body = req.body;
  res.status(StatusCodes.OK).json({ msg: 'Controller user controller' });
}
