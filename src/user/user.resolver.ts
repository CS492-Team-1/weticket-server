import { Resolver } from '@nestjs/graphql';

import { User } from './schemas';

@Resolver(() => User)
export class UserResolver {}
