import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { ReservationResolver } from './reservation.resolver';
import { ReservationService } from './reservation.service';
import { Reservation, ReservationSchema } from './schemas';

@Module({
  imports: [
    MongooseModule.forFeature([{name: Reservation.name, schema: ReservationSchema}])
  ],
  providers: [ReservationResolver, ReservationService]
})
export class ReservationModule {}
