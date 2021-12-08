import { Type } from 'class-transformer';
import { IsString } from 'class-validator';
import { BaseOutput } from 'src/common/dtos';

import { Field, InputType, ObjectType } from '@nestjs/graphql';

@InputType({
  description: '예약 취소에 필요한 데이터',
})
export class CancelReservationInput {
  @Field(() => String, {
    description: '예약 ID',
  })
  @IsString()
  @Type(() => String)
  reservationId: string;
}

@ObjectType({
  description: '예약 취소 반환 데이터',
})
export class CancelReservationOutput extends BaseOutput {}
