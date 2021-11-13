import { Model } from 'mongoose';
import { User } from 'src/user/schemas';

import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Cron, CronExpression } from '@nestjs/schedule';

import { ReservationStatus } from './enums';
import { Reservation, ReservationDocument } from './schemas';

@Injectable()
export class ReservationService {
  constructor(
    @InjectModel(Reservation.name)
    private reservations: Model<ReservationDocument>,
  ) {}

  private readonly logger = new Logger(ReservationService.name);

  async findById(reservationId: string) {
    return this.reservations.findById(reservationId).exec();
  }

  async findByTimeAndSeat(time: Date, seat: number) {
    return this.reservations
      .findOne({
        time,
        seat,
      })
      .exec();
  }

  async create(time: Date, seat: number, user: User) {
    const reservation = new this.reservations({
      time,
      seat,
      user,
      status: ReservationStatus.PREEMPTED,
      preemptedAt: new Date(),
    });

    return reservation.save();
  }

  async findByTime(time: Date) {
    return this.reservations.find({ time }).exec();
  }

  async updateStatus(reservationId: string, status: ReservationStatus) {
    return this.reservations
      .updateOne({ _id: reservationId }, { status })
      .exec();
  }

  async delete(reservationId: string) {
    return this.reservations.deleteOne({ _id: reservationId }).exec();
  }

  @Cron(CronExpression.EVERY_30_SECONDS)
  async invalidatePreemptedReservations() {
    const threshold = new Date();
    threshold.setMinutes(threshold.getMinutes() - 5);

    const result = await this.reservations
      .deleteMany({
        status: ReservationStatus.PREEMPTED,
        preemptedAt: {
          $lte: threshold,
        },
      })
      .exec();

    this.logger.log(
      `[Invalidation] ${threshold.toISOString()} | count : ${
        result.deletedCount
      }`,
    );
  }
}
