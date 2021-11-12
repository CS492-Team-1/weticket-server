import { registerEnumType } from '@nestjs/graphql';

export enum ReservationStatus {
  PREEMPTED = 'PREEMPTED',
  RESERVED = 'RESERVED',
}

registerEnumType(ReservationStatus, {
  name: 'ReservationStatus',
});
