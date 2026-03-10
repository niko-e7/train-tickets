import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Seat } from '../models';

@Component({
  selector: 'app-seat-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="modal-backdrop" *ngIf="open">
      <div class="modal">
        <h3>Select seats</h3>
        <div class="seatmap">
          <div *ngIf="seats.length === 0" style="color:#6b7280;padding:1rem 0">
            No seats available for this departure.
          </div>
          <div *ngIf="selectionLimitReached" style="width:100%;color:#eb8525;font-size:0.85rem;margin-bottom:0.5rem">
            Selection limit reached ({{maxSeats}} passenger{{maxSeats !== 1 ? 's' : ''}}).
          </div>
          <button *ngFor="let s of seats"
            [class.selected]="selected.indexOf(s.seatId) !== -1"
            [class.occupied]="s.isOccupied"
            (click)="toggle(s)"
            [disabled]="s.isOccupied"
            [title]="s.isOccupied ? 'Occupied' : 'Seat ' + s.number">
            <div style="font-weight:600">{{s.number}}</div>
            <div style="font-size:0.75rem;color:inherit;opacity:0.8">{{s.price | currency}}</div>
          </button>
        </div>
        <div class="actions">
          <button class="btn" (click)="close.emit()">Close</button>
          <button class="btn primary" (click)="apply()">Apply</button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .modal-backdrop{position:fixed;inset:0;background:rgba(0,0,0,0.4);display:flex;align-items:center;justify-content:center;z-index:1000}
    .modal{background:#fff;padding:1.25rem;border-radius:8px;width:min(540px,90vw);max-height:80vh;overflow-y:auto}
    .seatmap{display:flex;flex-wrap:wrap;gap:0.4rem;margin:0.75rem 0}
    .seatmap button{width:52px;height:44px;border:1px solid #d1d5db;border-radius:6px;cursor:pointer;background:#f9fafb;transition:background 0.15s}
    .seatmap button:hover:not(:disabled){border-color:#eb8525}
    .selected{background:#eb8525!important;color:#fff;border-color:#eb8525!important}
    .occupied{background:#e5e7eb!important;color:#9ca3af!important;cursor:not-allowed!important;text-decoration:line-through}
    .actions{display:flex;justify-content:flex-end;gap:0.5rem;margin-top:0.5rem}
  `]
})
export class SeatModalComponent {
  @Input() open = false;
  @Input() seats: Seat[] = [];
  @Input() selected: string[] = [];
  @Input() maxSeats = 0;
  @Output() close = new EventEmitter<void>();
  @Output() applied = new EventEmitter<string[]>();

  get selectionLimitReached(): boolean {
    return this.selected.length >= this.maxSeats;
  }

  toggle(s: Seat) {
    if (s.isOccupied) return;
    const i = this.selected.indexOf(s.seatId);
    if (i === -1) {
      if (this.selectionLimitReached) {
        
        return;
      }
      this.selected.push(s.seatId);
    } else {
      this.selected.splice(i, 1);
    }
    this.selected = [...this.selected];
  }
  apply() { this.applied.emit(this.selected); this.close.emit(); }
}
