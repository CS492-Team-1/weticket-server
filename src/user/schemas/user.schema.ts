import { Type } from 'class-transformer';
import { Document, Types } from 'mongoose';
import { Reservation } from 'src/reservation/schemas';

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
  password: string;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Reservation' }] })
  @Field(() => [Reservation])
  reservations: Reservation[];
}

export const UserSchema = SchemaFactory.createForClass(User);
