import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TrainView } from '../models';

@Component({
  selector: 'app-departure-list',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="list">
      <div *ngFor="let t of trains" class="item">
        <div class="info">
          <strong class="train-name">{{ t.name }}</strong>
          <div class="route">{{ t.from }} → {{ t.to }}</div>
          <div class="time">{{ t.departure }} – {{ t.arrive }}</div>
          <div class="date">{{ t.date }}</div>
        </div>
        <div class="actions">
          <button class="btn primary" (click)="onSelect(t)">Select</button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .list {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }

    .item {
      display: flex;
      flex-direction: column;
      padding: 1rem;
      border-radius: 8px;
      background: #0000002d;
      border: 1px solid #0000003d;
      box-shadow: 0 1px 2px rgba(0,0,0,0.05);
      transition: box-shadow 0.2s ease, border-color 0.2s ease, transform 0.2s ease;
    }

    .item:hover {
      box-shadow: 0 4px 6px rgba(0,0,0,0.07);
      border-color: #d1d5db;
      transform: scale(1.02);
    }

    .info {
      margin-bottom: 0.75rem;
    }

    .train-name {
      display: block;
      margin-bottom: 0.25rem;
      font-size: 1rem;
      font-weight: 600;
    }

    .route {
      color: #4b556300;
      font-size: 0.9375rem;
      margin-bottom: 0.25rem;
    }

    .time {
      color: #6b7280;
      font-size: 0.875rem;
    }

    .date {
      color: #9ca3af;
      font-size: 0.8125rem;
      margin-top: 0.125rem;
    }

    @media (min-width: 700px) {
      .item {
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
      }
      .info {
        margin-bottom: 0;
      }
      .actions {
        flex-shrink: 0;
        margin-left: 1rem;
      }
    }
  `]
})
export class DepartureListComponent {
  @Input() trains: TrainView[] = [];
  @Output() select = new EventEmitter<TrainView>();

  onSelect(t: TrainView): void {
    this.select.emit(t);
  }
}
