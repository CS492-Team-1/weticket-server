import { Document } from 'mongoose';

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
}

export const UserSchema = SchemaFactory.createForClass(User);
