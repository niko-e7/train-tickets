import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
@Component({
  selector: 'app-search-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <form [formGroup]="form" (ngSubmit)="onSearch()" class="card search-card">
      <div class="row">
        <label>From
          <select formControlName="from">
            <option value="">— any —</option>
            <option *ngFor="let s of stations" [value]="s.name">{{ s.name }}</option>
          </select>
        </label>
        <label>To
          <select formControlName="to">
            <option value="">— any —</option>
            <option *ngFor="let s of stations" [value]="s.name">{{ s.name }}</option>
          </select>
        </label>
        <label style="position: relative;">Date
          <input type="date" formControlName="date" [min]="today" />
          <span *ngIf="dateError" style="color:#ff6b6b;font-size:0.75rem;position:absolute;bottom:-1.2rem;white-space:nowrap">{{dateError}}</span>
        </label>
        <button class="btn primary" type="submit">Explore</button>
      </div>
    </form>
  `,
  styles: [`
    .search-card {
      background: rgba(255, 255, 255, 0.03);
      backdrop-filter: blur(6px);
      -webkit-backdrop-filter: blur(16px);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 20px;
      padding: 2rem;
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
      width: 100%;
    }
    .row {
      display: flex;
      gap: 1.5rem;
      align-items: flex-end;
      justify-content: center;
      flex-wrap: wrap;
    }
    label {
      display: flex;
      flex-direction: column;
      flex: 1;
      min-width: 140px;
      gap: 0.5rem;
      font-size: 0.75rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: #94a3b8;
    }
    select, input {
      padding: 0.75rem 1rem;
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 12px;
      background: rgba(0, 0, 0, 0.2);
      color: #ffffff;
      font-size: 0.9375rem;
      transition: all 0.2s ease;
      width: 100%;
    }
    select:focus, input:focus {
      outline: none;
      border-color: #ff8c32;
      background: rgba(0, 0, 0, 0.3);
      box-shadow: 0 0 0 4px rgba(255, 140, 50, 0.15);
    }
    option {
      background: #1a1a1a;
      color: #fff;
    }
    .btn.primary {
      background: linear-gradient(135deg, #ff8b326f, #ff5e00da);
      color: #fff;
      border: 0;
      padding: 0.875rem 2rem;
      border-radius: 12px;
      font-weight: 700;
      cursor: pointer;
      transition: all 0.3s ease;
      min-height: 48px;
    }
    .btn.primary:hover {
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(255, 94, 0, 0.3);
    }
    @media (max-width: 768px) {
      .search-card { padding: 1.5rem; }
      .row { gap: 1rem; }
      label { min-width: 100%; }
      .btn.primary { width: 100%; }
    }
  `]
})
export class SearchFormComponent implements OnInit {
  @Input() stations: any[] = [];
  form = new FormGroup({
    from: new FormControl(''),
    to: new FormControl(''),
    date: new FormControl('')
  });
  today = '';
  dateError = '';

  constructor(private router: Router) { }

  ngOnInit() {
    const d = new Date();
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    this.today = `${year}-${month}-${day}`;
  }

  onSearch(): void {
    this.dateError = '';
    const { from, to, date } = this.form.value;

    if (date && date < this.today) {
      this.dateError = 'Cannot select a past date.';
      return;
    }

    
    const queryParams: Record<string, string> = {};
    if (from) queryParams['from'] = from;
    if (to) queryParams['to'] = to;
    if (date) queryParams['date'] = date;
    this.router.navigate(['/departures'], { queryParams });
  }
}
