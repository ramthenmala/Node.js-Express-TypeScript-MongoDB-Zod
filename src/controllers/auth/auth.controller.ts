import { Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import { get } from 'lodash'
import { CreateSessionInput } from '../../schema/auth.schema'
import { findSessionById, signAccessToken, signInRefreshToken } from '../../service/auth.service'
import { findUserByEmail, findUserById } from '../../service/user.service'
import { verifyJwt } from '../../utils/jwt'

export const createSessionHandler = async (req: Request<{}, {}, CreateSessionInput>, res: Response) => {
    const message = 'Invalid email or password'
    const { email, password } = req.body
    const user = await findUserByEmail(email)

    if (!user) {
        return res.send(message)
    }

    if (!user.verified) {
        return res.send('Please verify your email')
    }

    const isValid = await user.validatePassword(password)
    if (!isValid) {
        return res.send(message)
    }
    // Sign a access Token
    const accessToken = signAccessToken(user)

    // Sign a refresh Token
    const refreshToken = await signInRefreshToken({ userId: user._id })

    // Send the Token

    return res.send({
        accessToken,
        refreshToken
    })
}

export const refreshAccessTokenHandler = async (req: Request, res: Response) => {
    const refreshToken = get(req, 'headers.x-refresh')
    const decoded = verifyJwt<{ session: string }>(refreshToken, 'refreshTokenPublicKey')
    if (!decoded) {
        return res.status(StatusCodes.UNAUTHORIZED).send('Could Not refresh Status Code')
    }

    const session = await findSessionById(decoded.session)

    if (!session || !session.valid) {
        return res.status(StatusCodes.UNAUTHORIZED).send('Could Not refresh Status Code')
    }

    const user = await findUserById(String(session.user))

    if (!user) {
        return res.status(StatusCodes.UNAUTHORIZED).send('Could Not refresh Status Code')
    }

    const accessToken = signAccessToken(user)
    return res.send({ accessToken })
}