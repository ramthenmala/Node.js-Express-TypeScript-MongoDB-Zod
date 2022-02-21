import { Request, Response } from 'express';
import { createUserInput } from '../schema/user.schema';

export async function createUserHandler(
  req: Request<{}, {}, createUserInput>,
  res: Response
) {
  const body = req.body;
}
