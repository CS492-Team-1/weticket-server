import { Type } from 'class-transformer';
import { IsString } from 'class-validator';
import { BaseOutput } from 'src/common/dtos';

import { Field, InputType, ObjectType } from '@nestjs/graphql';

@InputType()
export class LoginInput {
  @Field(() => String)
  @IsString()
  @Type(() => String)
  username: string;

  @Field(() => String)
  @IsString()
  @Type(() => String)
  password: string;
}

@ObjectType()
export class LoginOutput extends BaseOutput {
  @Field(() => String, { nullable: true })
  accessToken?: string;
}
