import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-passenger-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="passenger card">
      <form [formGroup]="form">
        <div class="row">
          <label>First name<input formControlName="name"/></label>
          <label>Surname<input formControlName="surname"/></label>
        </div>
        <div class="row">
          <label>Email<input formControlName="email"/></label>
          <label>Personal ID<input formControlName="pid"/></label>
        </div>
        <div class="row">
          <label>Phone<input formControlName="phone" type="tel" placeholder="+1 234 567 8900"/></label>
        </div>
        <div style="color:#7f1d1d;font-size:0.9rem;margin-top:0.4rem" *ngIf="form.invalid && (form.touched || form.dirty)">
          <div *ngIf="form.get('name')?.hasError('required')">First name is required</div>
          <div *ngIf="form.get('surname')?.hasError('required')">Surname is required</div>
          <div *ngIf="form.get('email')?.hasError('required')">Email is required</div>
          <div *ngIf="form.get('email')?.hasError('email')">Email is invalid</div>
          <div *ngIf="form.get('phone')?.hasError('required')">Phone is required</div>
          <div *ngIf="form.get('pid')?.hasError('required')">Personal ID is required</div>
        </div>
      </form>
      <div class="actions">
        <button class="btn" (click)="remove.emit()">Remove</button>
      </div>
    </div>
  `,
  styles: [`
    .passenger{padding:0.75rem;margin-bottom:0.5rem}
    .row{display:flex;gap:0.5rem}
    label{flex:1;display:flex;flex-direction:column}
    input{padding:0.4rem;border:1px solid rgb(102, 102, 102)}
  `]
})
export class PassengerFormComponent {
  @Input() form: any = new FormGroup({
    name: new FormControl('', Validators.required),
    surname: new FormControl('', Validators.required),
    phone: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email]),
    pid: new FormControl('', [Validators.required])
  });
  @Output() remove = new EventEmitter<void>();
}