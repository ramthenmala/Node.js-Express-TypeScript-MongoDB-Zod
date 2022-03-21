import { Request, Response, NextFunction } from 'express';
import { verifyJwt } from '../utils/jwt'

const userDeserialised = async (req: Request, res: Response, next: NextFunction) => {
    const accessToken = (req.headers.authorization || '').replace(/ˆBearer\s/, '');

    if (!accessToken) {
        return next()
    }

    const decoded = verifyJwt("accessToken", "accessTokenPublicKey")

    if (decoded) {
        res.locals.user = decoded
    }

    return next()
}

export default userDeserialised