import { Type } from 'class-transformer';
import { IsDate } from 'class-validator';
import { BaseOutput } from 'src/common/dtos';

import { Field, InputType, ObjectType } from '@nestjs/graphql';

import { Reservation } from '../schemas';

@InputType()
export class ReservationsInput {
  @Field(() => Date)
  @IsDate()
  @Type(() => Date)
  time: Date;
}

@ObjectType()
export class ReservationsOutput extends BaseOutput {
  @Field(() => [Reservation], { nullable: true })
  reservations?: Reservation[];
}
