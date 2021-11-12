import * as bcrypt from 'bcrypt';

import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';

import { LoginInput, LoginOutput, RegisterInput, RegisterOutput } from './dtos';
import { User } from './schemas';
import { UserService } from './user.service';

@Resolver(() => User)
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  // 임시 Query
  // 추후 Authentication 구현시 변경예정
  @Query(() => User)
  async me(@Args('id') id: string) {
    return this.userService.findOneById(id);
  }

  @Mutation(() => LoginOutput)
  async login(@Args('input') input: LoginInput): Promise<LoginOutput> {
    try {
      const user = await this.userService.findOneByUsername(input.username);

      if (!user) {
        return {
          ok: false,
          error: '아이디와 패스워드를 확인해주세요.',
        };
      }

      const passwordMatches = await bcrypt.compare(
        input.password,
        user.password,
      );
      if (!passwordMatches) {
        return {
          ok: false,
          error: '아이디와 패스워드를 확인해주세요.',
        };
      }

      return {
        ok: true,
        accessToken: 'PASS',
      };
    } catch (err) {
      return {
        ok: false,
        error: err.message,
      };
    }
  }

  @Mutation(() => RegisterOutput)
  async register(@Args('input') input: RegisterInput): Promise<RegisterOutput> {
    try {
      const { username, password } = input;

      const existingUser = await this.userService.findOneByUsername(username);

      if (existingUser) {
        return {
          ok: false,
          error: '이미 등록된 계정입니다.',
        };
      }
      const user = await this.userService.create(username, password);

      return {
        ok: true,
        user,
      };
    } catch (err) {
      return {
        ok: false,
        error: err.message,
      };
    }
  }
}
