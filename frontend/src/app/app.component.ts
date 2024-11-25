import { Component, OnInit } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { ReservationService } from './coworking/reservation/reservation.service';

@Component({
  selector: 'app-root',
  template: '<app-navigation></app-navigation>'
})
export class AppComponent implements OnInit {
  title = 'frontend';

  constructor(
    private matIconReg: MatIconRegistry,
    private reservationService: ReservationService
  ) {
    (window as any).ReservationService = this.reservationService;
  }

  ngOnInit() {
    this.matIconReg.setDefaultFontSetClass('material-symbols-outlined');
  }
}
