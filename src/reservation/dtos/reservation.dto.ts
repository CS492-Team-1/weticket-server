import { Type } from 'class-transformer';
import { IsString } from 'class-validator';
import { BaseOutput } from 'src/common/dtos';

import { Field, InputType, ObjectType } from '@nestjs/graphql';

import { Reservation } from '../schemas';

@InputType()
export class ReservationInput {
  @Field(() => String)
  @IsString()
  @Type(() => String)
  reservationId: string;
}

@ObjectType()
export class ReservationOutput extends BaseOutput {
  @Field(() => Reservation, { nullable: true })
  reservation?: Reservation;
}
