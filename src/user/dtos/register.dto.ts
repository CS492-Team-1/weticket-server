import { Type } from 'class-transformer';
import { IsString } from 'class-validator';
import { BaseOutput } from 'src/common/dtos';

import { Field, InputType, ObjectType } from '@nestjs/graphql';

import { User } from '../schemas';

@InputType()
export class RegisterInput {
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
export class RegisterOutput extends BaseOutput {
  @Field(() => User, { nullable: true })
  user?: User;
}
