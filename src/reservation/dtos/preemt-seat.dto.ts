import { Type } from 'class-transformer';
import { IsDate, IsString } from 'class-validator';
import { BaseOutput } from 'src/common/dtos';

import { Field, InputType, ObjectType } from '@nestjs/graphql';

import { Reservation } from '../schemas';

@InputType()
export class PreemptSeatInput {
  @Field(() => Date)
  @IsDate()
  @Type(() => Date)
  time: Date;

  @Field(() => [String])
  @IsString({ each: true })
  @Type(() => String)
  seats: string[];
}

@ObjectType()
export class PreemptSeatOutput extends BaseOutput {
  @Field(() => Reservation, { nullable: true })
  reservation?: Reservation;
}
