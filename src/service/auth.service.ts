import { DocumentType } from "@typegoose/typegoose"
import { omit } from 'lodash'
import SessionModel from "../models/session.model"
import { privateFields, User } from "../models/user.model"
import { signInJwt } from "../utils/jwt"

export const createSession = async ({ userId }: { userId: string }) => {
    return SessionModel.create({ user: userId })
}
// Refresh token with session 
export const signInRefreshToken = async ({ userId }: { userId: string }) => {
    const session = await createSession({
        userId
    })

    const refreshToken = signInJwt(
        { session: session._id },
        "refreshTokenPrivateKey",
        {
            expiresIn: '1yr'
        }
    )

    return refreshToken
}

export const signAccessToken = (user: DocumentType<User>) => {
    const payload = omit(user.toJSON(), privateFields)
    const accessToken = signInJwt(payload, "accessTokenPrivateKey", {
        expiresIn: "15m"
    })
    return accessToken
}

export const findSessionById = (id: string) => {
    return SessionModel.findById(id)
}