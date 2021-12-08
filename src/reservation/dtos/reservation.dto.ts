import { Type } from 'class-transformer';
import { IsString } from 'class-validator';
import { BaseOutput } from 'src/common/dtos';

import { Field, InputType, ObjectType } from '@nestjs/graphql';

import { Reservation } from '../schemas';

@InputType({
  description: '예약 정보를 불러오는데 필요한 데이터',
})
export class ReservationInput {
  @Field(() => String, { description: '예약 ID' })
  @IsString()
  @Type(() => String)
  reservationId: string;
}

@ObjectType({
  description: '예약 정보 반환 데이터',
})
export class ReservationOutput extends BaseOutput {
  @Field(() => Reservation, { nullable: true, description: '예약 정보' })
  reservation?: Reservation;
}
