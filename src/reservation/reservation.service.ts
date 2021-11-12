import { Model } from 'mongoose';

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { ReservationStatus } from './enums';
import { Reservation, ReservationDocument } from './schemas';

@Injectable()
export class ReservationService {
  constructor(
    @InjectModel(Reservation.name)
    private reservations: Model<ReservationDocument>,
  ) {}

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

  async create(time: Date, seat: number) {
    const reservation = new this.reservations({
      time,
      seat,
      status: ReservationStatus.PREEMPTED,
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
}
