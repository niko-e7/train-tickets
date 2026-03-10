import { Component, OnInit, OnDestroy, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../services/api.service';
import { BookingStoreService } from '../services/booking-store.service';
import { DepartureListComponent } from '../components/departure-list.component';
import { DepartureGroup, TrainView } from '../models';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-departures',
  standalone: true,
  imports: [CommonModule, DepartureListComponent],
  changeDetection: ChangeDetectionStrategy.Default,
  template: `
    <section class="card">
      <h2>Available departures</h2>

      <div *ngIf="loading" style="color:#0b63d6;padding:1rem">Loading departures...</div>

      <ng-container *ngIf="!loading">
        <div style="margin-bottom:0.5rem;color:#6b7280">
          Found: {{ filtered.length }} train{{ filtered.length !== 1 ? 's' : '' }}
          <span *ngIf="filterActive" style="margin-left:0.5rem;font-size:0.85rem">
            (filtered — <button style="background:none;border:none;color:#0b63d6;cursor:pointer;padding:0;font-size:0.85rem" (click)="clearFilter()">show all</button>)
          </span>
        </div>

        <div *ngIf="errorMessage" style="color:#7f1d1d;padding:1rem;background:#fff0f0;border-radius:6px;margin-bottom:1rem">
          {{ errorMessage }}
        </div>

        <div *ngIf="!errorMessage && filtered.length === 0" style="padding:1rem;color:#6b7280">
          No trains match your search.
        </div>

        <app-departure-list
          *ngIf="filtered.length > 0"
          [trains]="filtered"
          (select)="onSelect($event)">
        </app-departure-list>
      </ng-container>
    </section>
  `,
  styles: [`
    .card {
      max-width: 1100px;
      margin: 6rem auto;
      padding: 1.5rem;
    }
    h2 {
      margin: 0 0 1rem;
      font-size: 1.5rem;
      font-weight: 600;
      color: var(--text);
    }


    .card {
      background: linear-gradient(
271deg, #ff8b3207, #ff7b0042);
    }
  `]
})
export class DeparturesComponent implements OnInit, OnDestroy {
  allTrains: TrainView[] = [];
  filtered: TrainView[] = [];
  filterActive = false;
  errorMessage = '';
  loading = true; 

  private dataSub: Subscription | null = null;
  private routeSub: Subscription | null = null;

  constructor(
    private api: ApiService,
    private store: BookingStoreService,
    private route: ActivatedRoute,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.loading = true;
    this.errorMessage = '';


    this.dataSub = this.api.getDepartures().subscribe({
      next: (groups: DepartureGroup[]) => {
   
        this.allTrains = groups.flatMap(dep =>
          (dep.trains ?? []).map(t => ({
            id: t.id,
            number: t.number,
            name: t.name,
            from: t.from,
            to: t.to,
            date: t.date,
            departure: t.departure,
            arrive: t.arrive,
            departureId: dep.id,
            vagons: t.vagons      
          } as TrainView))
        );

      
        this.applyQueryFilter(this.route.snapshot.queryParams);

        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err: any) => {
        this.errorMessage = 'Failed to load departures: ' +
          (err?.status ? `${err.status} ${err.statusText}` : err?.message ?? 'Unknown error');
        this.loading = false;
        this.cdr.detectChanges();
      }
    });


    this.routeSub = this.route.queryParams.subscribe(q => {
      if (!this.loading && this.allTrains.length > 0) {
        this.applyQueryFilter(q);
        this.cdr.detectChanges();
      }
    });
  }

  ngOnDestroy(): void {
    this.dataSub?.unsubscribe();
    this.routeSub?.unsubscribe();
  }

  private isoToApiWeekdayKa(isoDate: string): string | null {
    if (!isoDate) return null;

    const d = new Date(isoDate + 'T00:00:00Z');
    if (isNaN(d.getTime())) return null;

    const map = [
      'კვირა',
      'ორშაბათი',
      'სამშაბათი',
      'ოთხშაბათი',
      'ხუთშაბათი',
      'პარასკევი',
      'შაბათი'
    ];

    return map[d.getUTCDay()];
  }

  private norm(v: any): string {
    return String(v ?? '')
      .trim()
      .toLowerCase()
      .normalize('NFC');
  }

  private applyQueryFilter(q: Record<string, any>): void {
    const from = (q['from'] ?? '').trim();
    const to = (q['to'] ?? '').trim();
    const isoDate = (q['date'] ?? '').trim();

    const weekdayKa = isoDate ? this.isoToApiWeekdayKa(isoDate) : null;

    const hasFilter = !!(from || to || isoDate);
    this.filterActive = hasFilter;

    if (!hasFilter) {
      this.filtered = [...this.allTrains];
      return;
    }

    this.filtered = this.allTrains.filter(t => {
      const matchFrom = !from || t.from === from;
      const matchTo = !to || t.to === to;
      const matchDate =
        !isoDate ||
        (weekdayKa !== null && this.norm(t.date) === this.norm(weekdayKa));

      return matchFrom && matchTo && matchDate;
    });
  }

  clearFilter(): void {
    this.router.navigate(['/departures']);
  }

  onSelect(train: TrainView): void {
    this.store.setSelectedDeparture(train);
    this.router.navigate(['/booking', train.id]);
  }
}
