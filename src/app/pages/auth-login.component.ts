import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-auth-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <section class="card">
      <h2>Login</h2>
      <form [formGroup]="form" (ngSubmit)="onSubmit()">
        <label>Email<input formControlName="email"/></label>
        <div *ngIf="form.get('email')?.invalid && (form.touched || form.dirty)" style="color:#7f1d1d">Enter a valid email</div>
        <label>Password<input type="password" formControlName="password"/></label>
        <div *ngIf="error" style="color:#7f1d1d;margin-top:0.5rem">{{error}}</div>
        <div style="margin-top:1rem"><button class="btn primary" type="submit" [disabled]="form.invalid">Login</button></div>
      </form>
    </section>
  `,
  styles: [':host{display:flex;align-items:center;justify-content:center;min-height:84vh;} .card{width:100%;max-width:480px;margin:0 auto;padding:1.5rem;}']
})
export class AuthLoginComponent {
  form = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required])
  });
  error = '';
  constructor(private auth: AuthService, private router: Router, private route: ActivatedRoute) { }

  onSubmit() {
    this.error = '';
    if (this.form.invalid) return;
    const email = this.form.value.email as string;
    const password = this.form.value.password as string;
    this.auth.login(email, password).subscribe(res => {
      if (!res.success) { this.error = res.message || 'Login failed'; return; }
      const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl') || '/';
      this.router.navigateByUrl(returnUrl);
    });
  }
}
