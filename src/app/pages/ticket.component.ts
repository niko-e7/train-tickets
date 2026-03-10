import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ApiService } from '../services/api.service';
import { BookingStoreService } from '../services/booking-store.service';

@Component({
  selector: 'app-ticket',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="tickets-container">
      <div class="header-actions">
        <h2 class="title">My Tickets</h2>
        <button class="btn print-all" (click)="print()" *ngIf="tickets.length">Print All</button>
      </div>

      <div *ngIf="tickets.length === 0" class="empty-state">
        <div class="icon">🎟️</div>
        <h3>No tickets found</h3>
        <p>You haven't booked any trips yet.</p>
        <button class="btn primary" routerLink="/departures">Book a Trip</button>
      </div>

      <div class="ticket-grid">
        <div *ngFor="let t of tickets" class="ticket-card" [class.cancelled]="t.status === 'cancelled'">
          <div class="ticket-header">
            <div class="brand-tiny">STEP RAILWAY</div>
            <div class="status-indicator" [class]="'status-' + (t.status || 'registered')">
              {{ t.status || 'Registered' }}
            </div>
          </div>
          
          <div class="ticket-body">
            <div class="main-info">
              <div class="trip-details">
                <div class="label">Trip #{{getTicketId(t).substring(0,6).toUpperCase()}}</div>
                <div class="route" *ngIf="t.trainName">{{ t.trainName }}</div>
                <div class="time" *ngIf="t.date">{{ t.date | date:'EEEE, MMM d, y' }}</div>
              </div>
              <div class="qr-placeholder">
                <div class="qr-box"></div>
              </div>
            </div>

            <div class="passengers-section">
              <div class="section-label">Passengers</div>
              <div class="passenger-list">
                <div *ngFor="let p of t.people" class="passenger-item">
                  <span class="p-name">{{p.name}} {{p.surname}}</span>
                  <span class="p-seat">Seat {{p.seatNumber || p.seatId || 'TBD'}}</span>
                </div>
                <!-- Fallback if people list is missing/nested differently -->
                <div *ngIf="!t.people?.length" class="passenger-item">
                  <span class="p-name">{{t.email}}</span>
                </div>
              </div>
            </div>
          </div>

          <div class="ticket-footer">
            <div class="actions">
              <button class="btn-sm secondary" (click)="refreshStatus(getTicketId(t))">Refresh</button>
              <button class="btn-sm primary" (click)="confirmTicket(getTicketId(t))" *ngIf="t.status !== 'confirmed' && t.status !== 'cancelled'">Confirm</button>
              <button class="btn-sm danger" (click)="cancelTicket(getTicketId(t))" *ngIf="t.status !== 'cancelled'">Cancel</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .tickets-container{max-width:900px;margin:7rem auto;padding:0 1.5rem}
    .header-actions{display:flex;justify-content:space-between;align-items:center;margin-bottom:2rem}
    .title{margin:0;font-size:1.875rem;font-weight:700;color:#fff}
    
    .empty-state{text-align:center;padding:4rem 2rem;background:#fff;border-radius:16px;border:1px dashed #d1d5db}
    .empty-state .icon{font-size:3rem;margin-bottom:1rem}
    .empty-state h3{font-size:1.25rem;color:#374151;margin-bottom:0.5rem}
    .empty-state p{color:#6b7280;margin-bottom:1.5rem}

    .ticket-grid{display:grid;grid-template-columns:repeat(auto-fill, minmax(400px, 1fr));gap:1.5rem}
    .ticket-card{background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 10px 15px -3px rgba(0,0,0,0.1);border:1px solid #e5e7eb;display:flex;flex-direction:column;transition:transform 0.2s}
    .ticket-card:hover{transform:translateY(-2px)}
    .ticket-card.cancelled{opacity:0.7;filter:grayscale(0.5)}

    .ticket-header{padding:1rem 1.5rem;background:#f9fafb;border-bottom:1px solid #f3f4f6;display:flex;justify-content:space-between;align-items:center}
    .brand-tiny{font-size:0.75rem;font-weight:800;color:#eb8525;letter-spacing:0.05em}
    .status-indicator{font-size:0.75rem;font-weight:600;text-transform:uppercase;padding:0.25rem 0.625rem;border-radius:9999px}
    .status-confirmed{background:#dcfce7;color:#166534}
    .status-registered{background:#fef9c3;color:#854d0e}
    .status-cancelled{background:#fee2e2;color:#991b1b}

    .ticket-body{padding:1.5rem;flex:1}
    .main-info{display:flex;justify-content:space-between;margin-bottom:1.5rem}
    .label{font-size:0.75rem;font-weight:600;color:#9ca3af;text-transform:uppercase;margin-bottom:0.25rem}
    .route{font-size:1.25rem;font-weight:700;color:#111827}
    .time{font-size:0.9rem;color:#4b5563}
    .qr-box{width:64px;height:64px;background:#f3f4f6;border-radius:8px;border:4px solid #fff;box-shadow:0 0 0 1px #e5e7eb}

    .passengers-section{margin-top:1rem}
    .section-label{font-size:0.75rem;font-weight:600;color:#9ca3af;text-transform:uppercase;margin-bottom:0.5rem;border-bottom:1px solid #f3f4f6;padding-bottom:0.25rem}
    .passenger-list{display:flex;flex-direction:column;gap:0.5rem}
    .passenger-item{display:flex;justify-content:space-between;font-size:0.95rem}
    .p-name{color:#374151;font-weight:500}
    .p-seat{color:#6b7280;background:#f3f4f6;padding:0.1rem 0.4rem;border-radius:4px;font-size:0.8rem}

    .ticket-footer{padding:1rem 1.5rem;background:#f9fafb;border-top:1px solid #f3f4f6}
    .actions{display:flex;gap:0.5rem;justify-content:flex-end}
    .btn-sm{padding:0.4rem 0.8rem;border-radius:6px;font-size:0.875rem;font-weight:600;cursor:pointer;transition:all 0.2s}
    .btn-sm.primary{background:#eb8525;color:#fff;border:none}
    .btn-sm.secondary{background:#fff;color:#4b5563;border:1px solid #d1d5db}
    .btn-sm.danger{background:#fff;color:#dc2626;border:1px solid #fee2e2}
    .btn-sm:hover{opacity:0.9}

    .btn.print-all{;border:1px solid #d1d5db;padding:0.5rem 1rem;border-radius:8px;font-weight:500}

    @media (max-width: 640px) {
      .ticket-grid{grid-template-columns:1fr}
    }

    @media print {
      .header-actions, .ticket-footer, .nav, .header{display:none}
      .tickets-container{margin:0;padding:0;max-width:none}
      .ticket-card{box-shadow:none;border:1px solid #000;break-inside:avoid;margin-bottom:2rem}
    }
  `]
})
export class TicketComponent implements OnInit {
  tickets: any[] = [];
  constructor(
    private route: ActivatedRoute,
    private api: ApiService,
    private store: BookingStoreService
  ) { }
  ngOnInit() {
    this.tickets = this.store.getTickets();
    const id = this.route.snapshot.paramMap.get('ticketId');
    // If it's a new ticket (id !== 'last' or similar), add it if not present
    if (id && id !== 'last') {
      const exists = this.tickets.find(t => this.getTicketId(t) === id);
      if (!exists) {
        this.api.checkStatus(id).subscribe(
          t => {
            this.store.addTicket(t);
            this.tickets = this.store.getTickets();
          },
          err => console.error('Failed to load ticket', err)
        );
      }
    }
  }
  getTicketId(t: any) { return t?.ticketId || t?.id || t?._id || t?.ticket_id || ''; }
  refreshStatus(ticketId: string): void {
    this.api.checkStatus(ticketId).subscribe(
      res => {
        const idx = this.tickets.findIndex(t => this.getTicketId(t) === ticketId);
        if (idx >= 0) {
          this.tickets[idx] = { ...this.tickets[idx], ...res };
          this.saveToStore();
        }
      },
      err => console.error('Failed to refresh status', err)
    );
  }
  confirmTicket(ticketId: string): void {
    this.api.confirm(ticketId).subscribe(
      res => {
        const idx = this.tickets.findIndex(t => this.getTicketId(t) === ticketId);
        if (idx >= 0) {
          this.tickets[idx] = { ...this.tickets[idx], status: 'confirmed', ...res };
          this.saveToStore();
        }
      },
      err => console.error('Failed to confirm ticket', err)
    );
  }
  cancelTicket(ticketId: string): void {
    if (!confirm('Are you sure you want to cancel this booking?')) return;
    this.api.cancel(ticketId).subscribe(
      res => {
        const idx = this.tickets.findIndex(t => this.getTicketId(t) === ticketId);
        if (idx >= 0) {
          this.tickets[idx] = { ...this.tickets[idx], status: 'cancelled', ...res };
          this.saveToStore();
        }
      },
      err => console.error('Failed to cancel ticket', err)
    );
  }
  private saveToStore(): void {
    // In our simplified store, we might need a method to save current array 
    // but addTicket already saves. For updates, we can just hack it if needed
    // or better, implement a sync method in store.
    // For now, let's just use localstorage directly as it's an imitation
    const key = (this.store as any).getTicketsKey?.() || 'booking_tickets_guest';
    try { localStorage.setItem(key, JSON.stringify(this.tickets)); } catch (e) { }
  }
  print() { window.print(); }
}
