import { Type } from 'class-transformer';
import { IsDate } from 'class-validator';

import { ArgsType, Field } from '@nestjs/graphql';

@ArgsType()
export class SubscriptionTime {
  @Field(() => Date)
  @IsDate()
  @Type(() => Date)
  time: Date;
}
