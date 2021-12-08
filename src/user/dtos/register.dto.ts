import { Type } from 'class-transformer';
import { IsString } from 'class-validator';
import { BaseOutput } from 'src/common/dtos';

import { Field, InputType, ObjectType } from '@nestjs/graphql';

import { User } from '../schemas';

@InputType({ description: '회원가입에 필요한 데이터' })
export class RegisterInput {
  @Field(() => String, { description: '아이디' })
  @IsString()
  @Type(() => String)
  username: string;

  @Field(() => String, { description: '비밀번호' })
  @IsString()
  @Type(() => String)
  password: string;
}

@ObjectType({ description: '회원가입 반환 데이터' })
export class RegisterOutput extends BaseOutput {
  @Field(() => User, { nullable: true, description: '가입된 유저' })
  user?: User;
}
