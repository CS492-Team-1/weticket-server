import * as bcrypt from 'bcrypt';
import { AuthUser } from 'src/auth/auth-user.decorator';
import { Auth } from 'src/auth/auth.decorator';
import { JwtService } from 'src/jwt/jwt.service';
import { Reservation } from 'src/reservation/schemas';

import {
  Args,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';

import { LoginInput, LoginOutput, RegisterInput, RegisterOutput } from './dtos';
import { User, UserDocument } from './schemas';
import { UserService } from './user.service';

@Resolver(() => User)
export class UserResolver {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  @Auth()
  @Query(() => User)
  async me(@AuthUser() user: User) {
    return user;
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
        accessToken: this.jwtService.sign(user._id),
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

  @ResolveField()
  async id(@Parent() user: UserDocument) {
    const { _id } = user;

    return _id;
  }

  @ResolveField()
  async reservations(@Parent() user: UserDocument) {
    const userWithReservations = await user.populate(
      'reservations',
      Reservation.name,
    );
    return userWithReservations.reservations;
  }
}
