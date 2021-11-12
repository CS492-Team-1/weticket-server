import { Resolver } from '@nestjs/graphql';

import { Reservation } from './schemas';

@Resolver(() => Reservation)
export class ReservationResolver {}
