import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-auth-signup',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <section class="card">
      <h2>Sign up</h2>
      <form [formGroup]="form" (ngSubmit)="onSubmit()">
        <label>Name<input formControlName="name"/></label>
        <label>Email<input formControlName="email"/></label>
        <div *ngIf="form.get('email')?.invalid && (form.touched || form.dirty)" style="color:#7f1d1d">Enter a valid email</div>
        <label>Phone<input type="tel" formControlName="phone" placeholder="+995599123456"/></label>
        <label>Password<input type="password" formControlName="password"/></label>
        <label>Confirm password<input type="password" formControlName="confirmPassword"/></label>
        <div *ngIf="error" style="color:#7f1d1d;margin-top:0.5rem">{{error}}</div>
        <div style="margin-top:1rem"><button class="btn primary" type="submit" [disabled]="form.invalid">Create account</button></div>
      </form>
    </section>
  `,
  styles: [':host{display:flex;align-items:center;justify-content:center;min-height:84vh;} .card{width:100%;max-width:480px;margin:0 auto;padding:1.5rem;box-sizing:border-box;}']
})
export class AuthSignupComponent {
  form = new FormGroup({
    name: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email]),
    phone: new FormControl('', [Validators.required, Validators.pattern(/^\+?[0-9]{9,15}$/)]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)]),
    confirmPassword: new FormControl('', [Validators.required])
  });
  error = '';
  constructor(private auth: AuthService, private router: Router) { }

  onSubmit() {
    this.error = '';
    if (this.form.invalid) return;
    const v = this.form.value as any;
    if (v.password !== v.confirmPassword) { this.error = 'Passwords do not match'; return; }
    this.auth.signup(v.name, v.email, v.phone, v.password).subscribe(res => {
      if (!res.success) { this.error = res.message || 'Signup failed'; return; }
      
      this.auth.login(v.email, v.password).subscribe(loginRes => {
        this.router.navigateByUrl('/');
      });
    });
  }
}
