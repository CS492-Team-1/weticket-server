import { Type } from 'class-transformer';
import { IsString } from 'class-validator';
import { BaseOutput } from 'src/common/dtos';

import { Field, InputType, ObjectType } from '@nestjs/graphql';

import { Reservation } from '../schemas';

@InputType({ description: '예약 확정에 필요한 데이터' })
export class ReserveSeatInput {
  @Field(() => String, { description: '예약 ID' })
  @IsString()
  @Type(() => String)
  reservationId: string;
}

@ObjectType({ description: '예약 확정 반환값' })
export class ReserveSeatOutput extends BaseOutput {
  @Field(() => Reservation, { nullable: true, description: '확정된 예약' })
  reservation?: Reservation;
}
