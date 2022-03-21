import jwt from 'jsonwebtoken';
import config from 'config'

export const signInJwt = async (object: Object, keyName: 'accessTokenPrivateKey' | 'refreshTokenPrivateKey', options?: jwt.SignOptions | undefined) => {

    const signingKey = Buffer.from(config.get<string>(keyName), "base64").toString('ascii')
    return jwt.sign(object, signingKey, {
        ...(options && options),
        algorithm: "RS256"
    })
}

export const verifyJwt = async<T>(token: string, keyName: 'accessTokenPublicKey' | 'refreshTokenPublicKey') => {
    const publicKey = Buffer.from(config.get<string>(keyName), "base64").toString('ascii')

    try {
        const decoded = jwt.verify(token, publicKey) as T
        return decoded
    } catch (e: any) {
        return null
    }
}