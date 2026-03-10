import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { ApiService } from '../services/api.service';
import { BookingStoreService } from '../services/booking-store.service';
import { Ticket } from '../models';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-status',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <div class="status-container">
      <section class="card">
        <h2>Check Ticket Status</h2>
        <p class="subtitle">Enter your ticket ID to see the latest update or select from your history below.</p>
        <form (ngSubmit)="check()" class="search-form">
          <div class="input-group">
            <input [formControl]="tid" placeholder="e.g. 5f2b8..."/>
            <button class="btn primary" type="submit">Check Status</button>
          </div>
        </form>
        
        <div *ngIf="loading" class="loading">Fetching status...</div>
        <div *ngIf="status" class="status-result">
          <div class="result-header">
             <strong>Status: <span [class]="'badge status-' + (status.status || 'unknown')">{{status.status || 'Unknown'}}</span></strong>
             <a [routerLink]="['/ticket', getTicketId(status)]" class="view-details">View Full Ticket</a>
          </div>
          <pre class="raw-data">{{status | json}}</pre>
        </div>
      </section>

      <section class="card history" *ngIf="history.length > 0">
        <h3>My Recent Bookings</h3>
        <div class="history-list">
          <div *ngFor="let t of history" class="history-item" (click)="checkManual(getTicketId(t))">
            <div class="item-info">
              <span class="ticket-id">#{{ getTicketId(t).substring(0,8) }}...</span>
              <span class="item-status" [class]="'status-' + (t.status || 'unknown')">{{ t.status || 'registered' }}</span>
            </div>
            <div class="item-action">Check</div>
          </div>
        </div>
      </section>
    </div>
  `,
  styles: [`
    .status-container{max-width:1100px;margin:6rem auto;padding:0 1rem;display:grid;gap:1.5rem}
    .card{padding:1.5rem;border-radius:12px;box-shadow:0 4px 6px -1px rgba(0,0,0,0.1);border:1px solid #e5e7eb}
    h2{margin-top:0;font-size:1.5rem;color:var(--text)}
    h3{margin-top:0;font-size:1.25rem;color:var(--text);margin-bottom:1rem}
    .subtitle{color:var(--text-light);margin-bottom:1.5rem;font-size:0.95rem}
    .input-group{display:flex;gap:0.5rem}
    input{flex:1;padding:0.75rem 1rem;border:1px solid var(--glassBorder);border-radius:8px;font-size:1rem;background: rgba(0,0,0,0.25);color:var(--text)}
    input:focus{outline:none;border-color:var(--accent);box-shadow:0 0 0 3px var(--accent-glow)}
    .btn.primary{background:var(--accent);color:#fff;border:none;padding:0.75rem 1.5rem;border-radius:8px;font-weight:600;cursor:pointer}
    
    .status-result{margin-top:1.5rem;padding:1rem;background:var(--glass);border-radius:8px;border:1px solid var(--glassBorder)}
    .result-header{display:flex;justify-content:space-between;align-items:center;margin-bottom:1rem}
    .badge{padding:0.25rem 0.6rem;border-radius:9999px;font-size:0.85rem;text-transform:uppercase}
    .status-confirmed{background:#dcfce7;color:#166534}
    .status-registered{background:#fef9c3;color:#854d0e}
    .status-cancelled{background:#fee2e2;color:#991b1b}
    .raw-data{font-size:0.8rem;background:rgba(0,0,0,0.2);padding:0.75rem;border-radius:4px;border:1px solid var(--glassBorder);overflow:auto;max-height:200px;color:var(--text-light)}
    .view-details{color:#eb8525;text-decoration:none;font-weight:500;font-size:0.9rem}

    .history-list{display:flex;flex-direction:column;gap:0.75rem}
    .history-item{display:flex;justify-content:space-between;align-items:center;padding:1rem;border:1px solid var(--glassBorder);border-radius:8px;cursor:pointer;transition:all 0.2s;transition-property: background, border-color, transform;}
    .history-item:hover{background:rgba(255,255,255,0.05);border-color:var(--accent);transform:scale(1.02)}
    .ticket-id{font-family:monospace;font-weight:600;color:var(--text)}
    .item-status{font-size:0.85rem;font-weight:500;padding:0.2rem 0.5rem;border-radius:4px}
    .item-action{font-size:0.85rem;color:#eb8525;font-weight:600}
    .loading{padding:1rem;text-align:center;color:#6b7280}
  `]
})
export class StatusComponent implements OnInit {
  tid = new FormControl('', { nonNullable: true });
  status: Ticket | null = null;
  history: any[] = [];
  loading = false;

  constructor(private api: ApiService, private store: BookingStoreService) { }

  ngOnInit() {
    this.history = this.store.getTickets();
  }

  getTicketId(t: any) { return t?.ticketId || t?.id || t?._id || ''; }

  checkManual(id: string) {
    this.tid.setValue(id);
    this.check();
  }

  check() {
    const id = this.tid.value.trim();
    if (!id) {
      this.status = null;
      return;
    }
    this.loading = true;
    this.status = null;
    this.api.checkStatus(id).subscribe({
      next: s => {
        this.status = s;
        this.loading = false;
        // Optionally update history if it was a new ID
        this.store.addTicket(s);
        this.history = this.store.getTickets();
      },
      error: err => {
        console.error('Status check failed', err);
        this.status = null;
        this.loading = false;
      }
    });
  }
}
