import { PubSub } from 'graphql-subscriptions';
import { AuthUser } from 'src/auth/auth-user.decorator';
import { Auth } from 'src/auth/auth.decorator';
import { PUB_SUB } from 'src/common/constants';
import { User } from 'src/user/schemas';
import { UserService } from 'src/user/user.service';

import { Inject } from '@nestjs/common';
import {
  Args,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
  Subscription,
} from '@nestjs/graphql';

import { SubscriptionTime } from './args';
import {
  CancelReservationInput,
  CancelReservationOutput,
  PreemptSeatInput,
  PreemptSeatOutput,
  ReservationsInput,
  ReservationsOutput,
  ReserveSeatInput,
  ReserveSeatOutput,
} from './dtos';
import { ReservationStatus } from './enums';
import { ReservationService } from './reservation.service';
import { Reservation, ReservationDocument } from './schemas';

@Resolver(() => Reservation)
export class ReservationResolver {
  constructor(
    private readonly reservationService: ReservationService,
    private readonly userService: UserService,
    @Inject(PUB_SUB) private readonly pubSub: PubSub,
  ) {}

  @Auth()
  @Query(() => ReservationsOutput)
  async reservations(
    @Args('input') input: ReservationsInput,
  ): Promise<ReservationsOutput> {
    try {
      const reservations = await this.reservationService.findByTime(input.time);

      return {
        ok: true,
        reservations,
      };
    } catch (err) {
      return {
        ok: false,
        error: err.message,
      };
    }
  }

  @Auth()
  @Mutation(() => PreemptSeatOutput)
  async preemptSeat(
    @Args('input') input: PreemptSeatInput,
    @AuthUser() user: User,
  ): Promise<PreemptSeatOutput> {
    try {
      const { time, seats } = input;

      const existingReservation = await this.reservationService.findByTimeAndSeats(
        time,
        seats,
      );
      if (existingReservation) {
        return {
          ok: false,
          error: '이미 예약된 좌석이 포함되어 있습니다.',
        };
      }

      const reservation = await this.reservationService.create(
        time,
        seats,
        user,
      );

      const _user = await this.userService.findOneByUsername(user.username);
      _user.reservations.push(reservation);
      await _user.save();

      this.pubSub.publish('newReservationOnTime', { reservation });

      return {
        ok: true,
        reservation,
      };
    } catch (err) {
      return {
        ok: false,
        error: err.message,
      };
    }
  }

  @Auth()
  @Mutation(() => ReserveSeatOutput)
  async reserveSeat(
    @Args('input') input: ReserveSeatInput,
    @AuthUser() user: User,
  ): Promise<ReserveSeatOutput> {
    try {
      const reservation = await this.reservationService.findById(
        input.reservationId,
      );
      if (!reservation) {
        return {
          ok: false,
          error: '존재하지 않는 예약입니다.',
        };
      }

      const reservationWithUser = await reservation.populate('user');

      const _user = await this.userService.findOneByUsername(user.username);

      if (reservationWithUser.user.username !== _user.username) {
        return {
          ok: false,
          error: '접근할 수 없는 예약입니다.',
        };
      }

      reservationWithUser.status = ReservationStatus.RESERVED;
      await reservationWithUser.save();

      return {
        ok: true,
        reservation: reservationWithUser,
      };
    } catch (err) {
      return {
        ok: false,
        error: err.message,
      };
    }
  }

  @Auth()
  @Mutation(() => CancelReservationOutput)
  async cancelReservation(
    @Args('input') input: CancelReservationInput,
    @AuthUser() user: User,
  ): Promise<CancelReservationOutput> {
    try {
      const reservation = await this.reservationService.findById(
        input.reservationId,
      );
      if (!reservation) {
        return {
          ok: false,
          error: '존재하지 않는 예약입니다.',
        };
      }

      const reservationWithUser = await reservation.populate('user');

      const _user = await this.userService.findOneByUsername(user.username);

      if (reservationWithUser.user.username !== _user.username) {
        return {
          ok: false,
          error: '접근할 수 없는 예약입니다.',
        };
      }

      this.pubSub.publish('canceledReservationOnTime', { reservation });
      await this.reservationService.delete(input.reservationId);

      return {
        ok: true,
      };
    } catch (err) {
      return {
        ok: false,
        error: err.message,
      };
    }
  }

  @Auth()
  @Subscription(() => Reservation, {
    filter: (payload, variables) => {
      return payload.reservation.time.getTime() === variables.time.getTime();
    },
    resolve: payload => payload.reservation,
  })
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  newReservationOnTime(@Args() { time }: SubscriptionTime) {
    return this.pubSub.asyncIterator('newReservationOnTime');
  }

  @Auth()
  @Subscription(() => Reservation, {
    filter: (payload, variables) => {
      return payload.reservation.time.getTime() === variables.time.getTime();
    },
    resolve: payload => payload.reservation,
  })
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  canceledReservationOnTime(@Args() { time }: SubscriptionTime) {
    return this.pubSub.asyncIterator('canceledReservationOnTime');
  }

  @ResolveField()
  async id(@Parent() reservation: ReservationDocument) {
    return reservation._id;
  }

  @ResolveField()
  async user(@Parent() reservation: ReservationDocument) {
    const reservationWithUser = await reservation.populate('user');
    return reservationWithUser.user;
  }
}
