import { Request, Response } from "express"
import { StatusCodes } from "http-status-codes"
import { CreateUserInput, ForgotPasswordInput, ResetPasswordInput, VerifyUserInput } from "../../schema/user.schema"
import { createUser, findUserByEmail, findUserById } from "../../service/user.service"
import { sendEmail } from "../../utils/mailer"
import log from "../../utils/logger"
import { nanoid } from "nanoid"

export const createUserHandler = async (req: Request<{}, {}, CreateUserInput>, res: Response) => {
    const body = req.body

    try {
        const user = await createUser(body)
        console.log(user)
        await sendEmail({
            from: 'test@example.com',
            to: user.email,
            subject: `Please verify your account`,
            text: `Verification code ${user.verificationCode} id: ${user._id}`
        })
        return res.status(StatusCodes.CREATED).send(`User Created Successfully`)
    } catch (e: any) {
        if (e.code === 11000) {
            return res.status(StatusCodes.CONFLICT).send(`Account Already Exists`)
        }
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(e)
    }
}

export const loginUserHandler = async (req: Request, res: Response) => {
    res.send(`LOGIN API WORKING`)
}

export const verifyUserHandler = async (req: Request<VerifyUserInput>, res: Response) => {
    const id = req.params.id
    const verificationCode = req.params.verificationCode

    // Find the user by _id
    const user = await findUserById(id)
    console.log(user)
    if (!user) {
        return res.send(`Could Not Verify User`)
    }

    // Check to see if the verificationCode matches
    if (user.verified) {
        return res.send(`User is already Verified`)
    }

    // Check the user is verified
    if (user.verificationCode === verificationCode) {
        user.verified = true
        await user.save()
        return res.send(`User Successfully Verified`)
    }

    return res.send(`Could Not Verify User`)
}

export const forgotPasswordHandler = async (req: Request<{}, {}, ForgotPasswordInput>, res: Response) => {
    const message = "If a user is registered with the email, will receive a password reset email"
    const { email } = req.body
    const user = await findUserByEmail(email)

    if (!user) {
        log.debug(`User with ${email} does not exists`)
        return res.send(message)
    }

    if (!user.verified) {
        return res.send(`The User is not verified`)
    }

    const passwordResetCode = nanoid()
    user.passwordResetCode = passwordResetCode

    await user.save()

    await sendEmail({
        to: user.email,
        from: 'test@example.com',
        subject: 'Reset your password',
        text: `Password reset code ${passwordResetCode} ID: ${user._id}`
    })
    log.debug(`Password reset email send to ${user._id} email : ${email}`)
    return res.send(message)
}

export const resetPasswordHandler = async (req: Request<ResetPasswordInput['params'], {}, ResetPasswordInput['body']>, res: Response) => {
    const { id, passwordResetCode } = req.params;
    const { password } = req.body
    const user = await findUserById(id)

    if (!user || !user.passwordResetCode || user.passwordResetCode !== passwordResetCode) {
        return res.status(StatusCodes.BAD_REQUEST).send(`Could not reset user Password`)
    }

    user.passwordResetCode = null;
    user.password = password;
    await user.save()
    return res.send('Successfully updated password')
}


export const getCurrentUserHandler = async (req: Request, res: Response) => {
    res.send(res.locals.user)
}