import { Component } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../services/auth.service';
@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterModule, CommonModule],
  template: `
    <header class="header">
      <div class="container-inner">
        <a class="brand" [routerLink]="['/']">STEP RAILWAY</a>
              <nav>
                <a routerLink="/departures">Departures</a>
                <a routerLink="/status">Check Status</a>
                <ng-container *ngIf="auth.isLoggedIn(); else guest">
                  <a (click)="logout()" style="cursor:pointer">Logout</a>
                </ng-container>
                <ng-template #guest>
                  <a routerLink="/auth/login">Login</a>
                  <a routerLink="/auth/signup">Sign up</a>
                </ng-template>
              </nav>
      </div>
    </header>
  `,
  styles: [
    `
    .header {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      z-index: 100;
      height: var(--nav-height, 72px);
      background: rgba(15, 15, 15, 0.65);
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
      border-bottom: 1px solid rgba(255, 255, 255, 0.08);
      display: flex;
      align-items: center;
      transition: all 0.3s ease;
    }
    .container-inner {
      max-width: var(--container-width, 1200px);
      margin: 0 auto;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 1.5rem;
      gap: 1.5rem;
    }
    .brand {
      font-family: 'Plus Jakarta Sans', sans-serif;
      font-weight: 800;
      color: #ffffff;
      text-decoration: none;
      font-size: 1.25rem;
      letter-spacing: -0.05em;
      text-transform: uppercase;
    }
    nav {
      display: flex;
      gap: 1rem;
      align-items: center;
    }
    nav a {
      color: #94a3b8;
      text-decoration: none;
      padding: 0.5rem 0.75rem;
      font-size: 0.875rem;
      font-weight: 500;
      border-radius: 6px;
      transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
    }
    nav a:hover {
      color: #ffffff;
      background: rgba(255, 255, 255, 0.05);
    }
    @media (max-width: 640px) {
      .header { padding: 0.75rem 0; }
      .brand { font-size: 1.125rem; }
      nav { gap: 0.25rem; }
      nav a { padding: 0.4rem 0.6rem; font-size: 0.75rem; }
    }
    `
  ]
})
export class HeaderComponent {
  constructor(public auth: AuthService, private router: Router) { }
  logout() { this.auth.logout(); this.router.navigateByUrl('/'); }
}
