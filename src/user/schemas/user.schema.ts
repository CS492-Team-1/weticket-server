import * as bcrypt from 'bcrypt';
import { Document } from 'mongoose';

import { InternalServerErrorException } from '@nestjs/common';
import { Field, ObjectType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type UserDocument = User & Document;

@Schema()
@ObjectType()
export class User {
  @Prop({ _id: true })
  @Field(() => String)
  id: string;

  @Prop({ required: true })
  @Field(() => String)
  username: string;

  @Prop({ required: true })
  @Field(() => String)
  password: string;

  checkPassword(aPassword: string): Promise<boolean> {
    try {
      return bcrypt.compare(aPassword, this.password);
    } catch {
      throw new InternalServerErrorException();
    }
  }
}

export const UserSchema = SchemaFactory.createForClass(User);
