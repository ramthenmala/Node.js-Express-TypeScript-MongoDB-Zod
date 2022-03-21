import { Request, Response, NextFunction } from 'express';
import { AnyZodObject } from 'zod';
import { StatusCodes } from 'http-status-codes';
import log from '../utils/logger';

const validateResource = (schema: AnyZodObject) => (req: Request, res: Response, next: NextFunction) => {
    try {
        schema.parse({
            body: req.body,
            query: req.query,
            params: req.params,
        });
        next()
        console.log('Validate Resource')
    } catch (e: any) {
        console.log(req.body)
        console.log(e)
        return res.status(StatusCodes.BAD_REQUEST).send(e)
    }
}

export default validateResource