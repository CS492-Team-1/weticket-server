import { Type } from 'class-transformer';
import { IsDate } from 'class-validator';
import { BaseOutput } from 'src/common/dtos';

import { Field, InputType, ObjectType } from '@nestjs/graphql';

import { Reservation } from '../schemas';

@InputType({ description: '예약 목록을 불러오는데 필요한 데이터' })
export class ReservationsInput {
  @Field(() => Date, {
    description: '일시(YYYY-MM-DD HH:mm)',
  })
  @IsDate()
  @Type(() => Date)
  time: Date;
}

@ObjectType({ description: '예약 목록 반환 데이터' })
export class ReservationsOutput extends BaseOutput {
  @Field(() => [Reservation], { nullable: true, description: '예약 목록' })
  reservations?: Reservation[];
}
