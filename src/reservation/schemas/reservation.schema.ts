import { Document, Types } from 'mongoose';
import { User } from 'src/user/schemas';

import { Field, ObjectType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { ReservationStatus } from '../enums';

export type ReservationDocument = Reservation & Document;

@Schema()
@ObjectType()
export class Reservation {
  @Prop({ _id: true })
  @Field(() => String, { description: '예약 ID' })
  id: string;

  @Prop({ required: true, type: Date })
  @Field(() => Date, { description: '예약 일시' })
  time: Date;

  @Prop({ required: true, type: [String] })
  @Field(() => [String], { description: '좌석 목록' })
  seats: string[];

  @Prop({ required: true, enum: ReservationStatus })
  @Field(() => ReservationStatus, { description: '예약 상태' })
  status: ReservationStatus;

  @Prop({ type: Date })
  @Field(() => Date, { nullable: true, description: '선점 시간' })
  preemptedAt?: Date;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  @Field(() => User, { description: '예약유저' })
  user: User;
}

export const ReservationSchema = SchemaFactory.createForClass(Reservation);
