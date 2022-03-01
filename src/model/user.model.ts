import {
  getModelForClass,
  modelOptions,
  prop,
  Severity,
  pre,
  DocumentType,
} from '@typegoose/typegoose';
import argon2 from 'argon2';
import { nanoid } from 'nanoid';
import log from '../utils/logger';

@pre<User>('save', async function () {
  if (!this.isModified('password')) {
    return;
  }
  const hash = await argon2.hash(this.password);
  this.password = hash;
  return;
})
// Passing Model Options
@modelOptions({
  schemaOptions: {
    timestamps: true,
  },
  options: {
    allowMixed: Severity.ALLOW,
  },
})

// Schema for User
export class User {
  @prop({ lowercase: true, required: true, unique: true })
  email: string;

  @prop({ required: true })
  firstName: string;

  @prop({ required: true })
  lastName: string;

  @prop({ required: true })
  password: string;

  @prop({ required: true, default: () => nanoid() })
  verificationCode: string | null;

  @prop()
  passwordResetCode: string;

  @prop({ default: false })
  verified: boolean;

  //  Method
  async validatePassword(this: DocumentType<User>, candidatePassword: string) {
    try {
      return await argon2.verify(this.password, candidatePassword);
    } catch (error) {
      log.info(error, `Could not validate Password`);
      return false;
    }
  }
}

const UserModel = getModelForClass(User);
export default UserModel;
