// Registration Handler

import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { CreateUserInput } from '../schema/user.schema';
import { createUser } from '../service/user.service';
import sendEmail from '../utils/mailer';

export async function createUserHandler(
  req: Request<{}, {}, CreateUserInput>,
  res: Response
) {
  const body = req.body;

  try {
    const user = await createUser(body);
    await sendEmail();
    return res.status(StatusCodes.CREATED).send('user Successfully Created');
  } catch (e: any) {
    // If unique Constrain has violated
    if (e.code === 11000) {
      return res.status(StatusCodes.CONFLICT).send('Account already Exists');
    }
    return res.send(StatusCodes.INTERNAL_SERVER_ERROR).send(e);
  }
}
