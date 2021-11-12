import { JwtService } from 'src/jwt/jwt.service';
import { User } from 'src/user/schemas';
import { UserService } from 'src/user/user.service';

import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
  ) {}
  async canActivate(context: ExecutionContext) {
    const needAuth = this.reflector.get<boolean>('auth', context.getHandler());

    if (!needAuth) return true;

    const gqlContext = GqlExecutionContext.create(context).getContext();
    const token = gqlContext['token'];
    if (!token) {
      return false;
    }

    let user: User;

    try {
      const decoded = this.jwtService.verify(token.toString());
      if (typeof decoded === 'object' && decoded.hasOwnProperty('id')) {
        const foundUser = await this.userService.findOneById(decoded['id']);
        user = foundUser;
      }
    } catch {
      return false;
    }

    if (!user) return false;

    gqlContext['user'] = user;
    return true;
  }
}
