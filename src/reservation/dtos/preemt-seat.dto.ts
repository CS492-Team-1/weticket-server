import { Type } from 'class-transformer';
import { IsDate, IsString } from 'class-validator';
import { BaseOutput } from 'src/common/dtos';

import { Field, InputType, ObjectType } from '@nestjs/graphql';

import { Reservation } from '../schemas';

@InputType({
  description: '좌석 선점에 필요한 데이터',
})
export class PreemptSeatInput {
  @Field(() => Date, { description: '예약 일시(YYYY-MM-DD HH:mm)' })
  @IsDate()
  @Type(() => Date)
  time: Date;

  @Field(() => [String], { description: '선택한 좌석 목록' })
  @IsString({ each: true })
  @Type(() => String)
  seats: string[];
}

@ObjectType({
  description: '좌석 선점 반환 데이터',
})
export class PreemptSeatOutput extends BaseOutput {
  @Field(() => Reservation, { nullable: true, description: '선점된 좌석' })
  reservation?: Reservation;
}
