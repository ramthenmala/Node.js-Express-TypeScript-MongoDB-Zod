import { Request, Response, NextFunction } from 'express'
import { StatusCodes } from "http-status-codes"

const requireUser = (req: Request, res: Response, next: NextFunction) => {
    const user = res.locals.user

    if (!user) {
        return res.status(StatusCodes.FORBIDDEN)
    }

    next()
}

export default requireUser
