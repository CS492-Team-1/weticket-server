import { Type } from 'class-transformer';
import { IsString } from 'class-validator';
import { BaseOutput } from 'src/common/dtos';

import { Field, InputType, ObjectType } from '@nestjs/graphql';

@InputType()
export class CancelReservationInput {
  @Field(() => String)
  @IsString()
  @Type(() => String)
  reservationId: string;
}

@ObjectType()
export class CancelReservationOutput extends BaseOutput {}
