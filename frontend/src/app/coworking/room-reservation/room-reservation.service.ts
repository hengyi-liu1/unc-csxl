/**
 * The Room Reservation Service abstracts HTTP requests to the backend
 * from the components.
 *
 * @author Aarjav Jain, John Schachte, Nick Wherthey, Yuvraj Jain
 * @copyright 2023
 * @license MIT
 */

import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import {
  parseReservationJSON,
  Reservation,
  ReservationJSON
} from '../coworking.models';
import { ReservationService } from '../reservation/reservation.service';

@Injectable({
  providedIn: 'root'
})
export class RoomReservationService extends ReservationService {
  constructor(http: HttpClient) {
    super(http);
  }

  private thirtyMinutesInMillis = 30 * 60 * 1000;

  isReservingMoreThanHalfHourInAdvance(reservation: Reservation): boolean {
    return reservation.start.getTime() - reservation.created_at.getTime() > this.thirtyMinutesInMillis;
  }

  hasEnoughPeople(reservation: Reservation): boolean {
    return reservation.users.length >= Math.ceil(reservation.room?.capacity! / 2);
  }

  halfFillConstraintSatisfied(reservation: Reservation): boolean {
    return !this.isReservingMoreThanHalfHourInAdvance(reservation) || this.hasEnoughPeople(reservation);
  }

  getMininumPeopleToAdd(reservation: Reservation) {
    return Math.ceil(reservation.room?.capacity! / 2) - reservation.users.length;
  }

  getNumHoursStudyRoomReservations(): Observable<string> {
    return this.http.get<string>('/api/coworking/user-reservations/');
  }
}
