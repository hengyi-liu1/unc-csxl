import { Component, Input } from '@angular/core';
import { Reservation, ReservationJSON } from '../../coworking.models';
import { ProfileService, PublicProfile } from 'src/app/profile/profile.service';
import { HttpClient } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { RoomReservationService } from '../../room-reservation/room-reservation.service';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'coworking-reservation-facts',
  templateUrl: './reservation-facts.widget.html',
  styleUrl: './reservation-facts.widget.css'
})
export class ReservationFactsWidget {
  @Input() reservation!: Reservation;

  setUsers: PublicProfile[] = [];

  constructor(
    protected profileService: ProfileService,
    protected http: HttpClient,
    protected snackBar: MatSnackBar,
    public roomReservationService: RoomReservationService
  ) {}

  ngOnInit() {
    this.setUsers = this.profileService.profilesToPublicProfiles(
      this.reservation.users
    );
  }

  getHalfFillWarning(): string {
    const minPeopleToAdd = this.roomReservationService.getMininumPeopleToAdd(
      this.reservation
    );
    const action = this.reservation.state === 'DRAFT' ? 'reserve' : 'confirm';
    return `* Please add ${minPeopleToAdd} more ${
      minPeopleToAdd == 1 ? 'person' : 'people'
    } to ${action}`;
  }

  checkinDeadline(reservationStart: Date, reservationEnd: Date): Date {
    return new Date(
      Math.min(
        reservationStart.getTime() + 10 * 60 * 1000,
        reservationEnd.getTime()
      )
    );
  }

  async onUsersChanged(newUsers: PublicProfile[]) {
    try {
      const changedUsers =
        await this.profileService.publicProfilesToProfiles(newUsers);

      const response = await firstValueFrom(
        this.http.put<Reservation>(
          `/api/coworking/reservation/${this.reservation.id}`,
          {
            id: this.reservation.id,
            users: changedUsers
          }
        )
      );

      // Update the reservation users based on the state
      if (this.reservation.state === 'EDIT') {
        // If frontend is in edit state, put changedUsers list to backend, and backend has no error
        // Then the changedUsers list is valid, assign it to reservation.users to reflect update
        this.reservation.users = changedUsers;
      } else {
        this.reservation.users = response.users;
      }
    } catch (error: any) {
      // Error in backend, changedUsers list is not valid, reshow the original users list in reservation
      this.setUsers = this.profileService.profilesToPublicProfiles(
        this.reservation.users
      );
      this.snackBar.open(error.error.message, '', { duration: 8000 });
    }
  }
}
