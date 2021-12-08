import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class BaseOutput {
  @Field(() => Boolean, { description: '정상 처리 여부' })
  ok: boolean;

  @Field(() => String, { nullable: true, description: '에러 메시지' })
  error?: string;
}
