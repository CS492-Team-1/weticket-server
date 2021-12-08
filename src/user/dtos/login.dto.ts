import { Type } from 'class-transformer';
import { IsString } from 'class-validator';
import { BaseOutput } from 'src/common/dtos';

import { Field, InputType, ObjectType } from '@nestjs/graphql';

@InputType({ description: '로그인에 필요한 데이터' })
export class LoginInput {
  @Field(() => String, { description: '아이디' })
  @IsString()
  @Type(() => String)
  username: string;

  @Field(() => String, { description: '비밀번호' })
  @IsString()
  @Type(() => String)
  password: string;
}

@ObjectType({ description: '로그인 반환 데이터' })
export class LoginOutput extends BaseOutput {
  @Field(() => String, { nullable: true, description: '인증 토큰' })
  accessToken?: string;
}
