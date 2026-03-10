import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ApiService } from '../services/api.service';
import { timeout, finalize } from 'rxjs/operators';
import { Seat, Vagon } from '../models';
import { BookingStoreService } from '../services/booking-store.service';
import { PassengerFormComponent } from '../components/passenger-form.component';
import { SummarySidebarComponent } from '../components/summary-sidebar.component';
import { SeatModalComponent } from '../components/seat-modal.component';

@Component({
  selector: 'app-booking',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, PassengerFormComponent, SummarySidebarComponent, SeatModalComponent],
  template: `
    <div class="grid booking">
      <div class="main card">
        <h2>Booking</h2>
        <div *ngFor="let ctrl of passengers.controls; let i = index">
          <app-passenger-form [form]="ctrl" (remove)="removePassenger(i)"></app-passenger-form>
        </div>
        <div style="margin-top:1rem; display:flex; gap:1rem; margin-left:10px;">
          <button class="btn" (click)="addPassenger()">Add passenger</button>
          <button class="btn primary" (click)="openSeatModal()" [disabled]="seatsLoading">
            {{ seatsLoading ? 'Loading seats...' : 'Select seats' }}
          </button>
        </div>
      </div>
        <app-summary-sidebar 
          [data]="summary" 
          [canProceed]="canProceed" 
          [loading]="bookingLoading"
          (proceed)="onContinue()">
        </app-summary-sidebar>
    </div>
    <app-seat-modal 
      [open]="seatOpen" 
      [seats]="seatMap" 
      [selected]="selectedSeats" 
      [maxSeats]="passengers.length"
      (applied)="applySeats($event)" 
      (close)="seatOpen=false">
    </app-seat-modal>
    <div style="max-width:980px;margin:0.5rem auto;padding:0 1rem">


      <div *ngIf="bookingError" style="color:#7f1d1d">{{bookingError}}</div>
    </div>
  `,
  styles: [
    `
    /* Mobile-first: single column */
    .booking{display:grid;grid-template-columns:1fr;gap:1rem;max-width:980px;margin:5rem auto 0 auto;min-height:85vh;align-content:center}
    .main{padding:1rem}
    .card{padding:1rem}

    /* Make summary button full-width on small screens and ensure tappable sizes */
    .sidebar .btn{width:100%;min-height:44px}

    @media(min-width:700px){
      /* Two-column layout on tablet+ */
      .booking{grid-template-columns:1fr 320px}
      .main{padding:1rem}
    }
    
    .main { /* the element was .main.card */
      display: block;
      align-items: normal;
    }

    div {
      display: inline-block;
      margin-left: 10px;
      border-radius: var(--radius-sm);
    }

      
    `
  ]
})
export class BookingComponent implements OnInit {
  departureId: string | null = null;
  form: FormGroup;
  seatOpen = false;
  seatMap: Seat[] = [];
  selectedSeats: string[] = [];
  summary: any = { passengers: [], seats: [], total: 0 };
  bookingLoading = false;
  seatsLoading = false;
  bookingError = '';

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private api: ApiService,
    private store: BookingStoreService,
    private router: Router
  ) {
    this.form = this.fb.group({ passengers: this.fb.array([]) });
  }
  get canProceed(): boolean {
    return this.form.valid &&
      (this.selectedSeats.length === this.passengers.length) &&
      this.passengers.length > 0 &&
      !this.bookingLoading &&
      !this.seatsLoading;
  }
  get passengers() { return this.form.get('passengers') as FormArray; }
  ngOnInit() {
    this.departureId = this.route.snapshot.paramMap.get('departureId');
    const departure = this.store.getSelectedDeparture();
    if (departure) {
      this.summary.departure = departure;
    }
    this.addPassenger();
  }
  addPassenger() {
    this.passengers.push(this.fb.group({ name: ['', Validators.required], surname: ['', Validators.required], phone: ['', Validators.required], email: ['', [Validators.required, Validators.email]], pid: ['', Validators.required] }));
    this.calculateTotal();
  }
  removePassenger(i: number) {
    this.passengers.removeAt(i);
    this.calculateTotal();
  }
  openSeatModal() {
    const departure = this.store.getSelectedDeparture();
    this.bookingError = '';
    this.seatsLoading = true;

    this.api.getVagons().pipe(
      finalize(() => { this.seatsLoading = false; })
    ).subscribe({
      next: (allVagons: Vagon[]) => {
        this.processVagons(allVagons, departure);
      },
      error: (err) => {
        console.error('Failed to load wagons', err);
        this.bookingError = 'Failed to load seat data. Please try again.';
        this.seatOpen = true;
      }
    });
  }

  private processVagons(allVagons: Vagon[], departure: any) {
    const trainId = departure?.id || departure?.trainId;
    const trainVagons = allVagons.filter(v =>
      String(v.trainId) === String(trainId) || (v.trainNumber && String(v.trainNumber) === String(departure?.number))
    );

    if (trainVagons.length > 0) {
      const seats: Seat[] = trainVagons.flatMap((v: Vagon) =>
        (v.seats || []).map((s: any) => ({
          seatId: s.seatId || s.id || s._id || String(s.number),
          number: s.number || s.seatNumber,
          price: s.price ?? departure?.price ?? 100,
          isOccupied: s.isOccupied ?? s.occupied ?? false,
          vagonId: String(v.id)
        } as Seat))
      );

      if (seats.length) {
        this.seatMap = seats;
        this.seatOpen = true;
        return;
      }
    }


    if (departure?.vagons && Array.isArray(departure.vagons) && departure.vagons.length) {
      const firstVagonId = departure.vagons?.id || departure.vagons?._id || departure.vagons;
      if (typeof firstVagonId === 'string' || typeof firstVagonId === 'number') {
        this.api.getVagon(String(firstVagonId)).subscribe({
          next: (v: Vagon) => { this.seatMap = v.seats || []; this.seatOpen = true; },
          error: err => { this.bookingError = 'No seats available for this departure.'; this.seatOpen = true; }
        });
        return;
      }
    }

    this.bookingError = 'No seat data available for this departure. No seats available for this departure.';
    this.seatOpen = true;
  }
  applySeats(seats: string[]) {
    this.selectedSeats = seats;
    this.store.setSelectedSeats(seats);
    this.calculateTotal();
  }
  calculateTotal() {
    const pricePerSeat = this.summary?.departure?.price || 100;
    this.summary.passengers = this.passengers.value;

   
    this.summary.seats = this.selectedSeats.map(id => {
      const seat = this.seatMap.find(s => s.seatId === id);
      return seat ? seat.number : id;
    });

    this.summary.total = this.selectedSeats.length * pricePerSeat;
  }

  onContinue() {
    
    if (this.form.invalid) {
      this.bookingError = 'Please complete passenger details correctly.';
      this.form.markAllAsTouched();
      return;
    }
    if (this.selectedSeats.length !== this.passengers.length) {
      this.bookingError = 'Assign one seat per passenger before continuing.';
      return;
    }

    const passengers = this.passengers.value || [];
    const departure = this.store.getSelectedDeparture();
    const trainId = departure?.id;
    const dateIso = (this.store.getSearchCriteria()?.date) ? new Date(this.store.getSearchCriteria().date as string).toISOString() : new Date().toISOString();

    const people = passengers.map((p: any, idx: number) => ({
      seatId: this.selectedSeats[idx],
      name: p.name,
      surname: p.surname,
      idNumber: p.pid,
      status: 'registered',
      payedCompleted: false
    }));

    const payload = {
      trainId: trainId,
      date: dateIso,
      email: passengers?.email || '',
      phoneNumber: passengers?.phone || '',
      people: people
    };

    console.log('Registering ticket payload:', payload);
    this.bookingLoading = true;
    this.bookingError = '';

    this.api.registerTicket(payload).pipe(
      timeout(15000),
      finalize(() => { this.bookingLoading = false; })
    ).subscribe({
      next: (res: string) => {
        console.log('Register response (raw):', res);

        let ticketId = '';
        
        try {
          const parsed = JSON.parse(res);
          ticketId = parsed?.ticketId || parsed?.id || parsed?._id;
        } catch (e) {
          
          const match = res.match(/[a-f0-9-]{10,}/i);
          if (match) ticketId = match[0];
        }

        if (ticketId) {
          this.store.addTicket({ ticketId, passengers: people, status: 'registered', date: dateIso });
          this.router.navigate(['/payment', ticketId]);
        } else {
          this.router.navigate(['/status']);
        }
      },
      error: err => {
        console.error('Failed to register ticket', err);
        
        this.bookingLoading = false;
        const serverMsg = err?.error?.message || (err?.error && typeof err.error === 'string' ? err.error : null) || err?.message || err?.statusText;
        if ((err as any)?.name === 'TimeoutError') {
          this.bookingError = 'Booking timed out. Please try again.';
        } else if (err && (err.status === 0 || err.status === undefined)) {
          this.bookingError = 'Network or CORS error while booking. Check browser console.';
        } else if (err?.status === 400 && serverMsg) {
          this.bookingError = `Booking failed (400): ${serverMsg}`;
        } else {
          this.bookingError = `Booking failed: ${err?.status || ''} ${serverMsg || ''}`;
        }
      }
    });
  }
}