import { Document } from 'mongoose';

import { Field, ObjectType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { ReservationStatus } from '../enums';

export type ReservationDocument = Reservation & Document;

@Schema()
@ObjectType()
export class Reservation {
  @Prop({ _id: true })
  @Field(() => String)
  id: string;

  @Prop({ required: true, type: Date })
  @Field(() => Date)
  time: Date;

  @Prop({ required: true, type: Number })
  @Field(() => Number)
  seat: number;

  @Prop({ required: true, enum: ReservationStatus })
  @Field(() => ReservationStatus)
  status: ReservationStatus;

  @Prop({ type: Date })
  @Field(() => Date, { nullable: true })
  preemptedAt?: Date;

  @Prop({ type: Date })
  @Field(() => Date, { nullable: true })
  reservedAt?: Date;
}

export const ReservationSchema = SchemaFactory.createForClass(Reservation);
