import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { SearchFormComponent } from '../components/search-form.component';
import { ApiService } from '../services/api.service';
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, SearchFormComponent],
  template: `
    <div class="hero">
      <div class="hero__overlay"></div>
      <div class="hero__content">
        <h1 class="hero__title">STEP RAILWAY</h1>
        <p class="hero__subtitle">
          Your journey begins here. Book tickets easily and travel comfortably.
        </p>
        <section class="card">
          <h2 class="card__title">Search trains</h2>
          <app-search-form [stations]="stations"></app-search-form>
        </section>
      </div>
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
   
        margin: -1.5rem -1rem;
      }
      .hero {
        position: relative;
        width: 100%;
        min-height: 100vh;
        background: url('/assets/trainstation.png') center / cover no-repeat;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 150px 24px 80px;
        overflow-y: auto;
      }
      .hero__overlay {
        position: absolute;
        inset: 0;
        background: linear-gradient(to bottom, rgba(0, 0, 0, 0.7) 0%, rgba(0, 0, 0, 0.4) 50%, rgba(0, 0, 0, 0.8) 100%);
        pointer-events: none;
      }
      .hero__content {
        position: relative;
        z-index: 1;
        width: min(1100px, 100%);
        text-align: center;
        color: #ffffff;
      }
      .hero__title {
        font-family: 'Plus Jakarta Sans', sans-serif;
        font-size: clamp(40px, 8vw, 72px);
        font-weight: 800;
        letter-spacing: -0.04em;
        line-height: 1.1;
        margin: 0 0 20px;
        background: linear-gradient(180deg, #fff 0%, rgba(255, 255, 255, 0.7) 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
      }
      .hero__subtitle {
        margin: 0 auto 40px;
        max-width: 600px;
        font-size: clamp(16px, 2.5vw, 20px);
        color: #94a3b8;
        font-weight: 500;
        line-height: 1.6;
      }
      .card {
        margin: 0 auto;
        padding: 0;
        background: transparent;
        border: none;
        box-shadow: none;
      }
      /* related resource: home.component.ts:52:9 */
.card[_ngcontent-ng-c1468623969] { /* the element was section.card */
  backdrop-filter: none;
}
    
    `,
  ],
})
export class HomeComponent implements OnInit, OnDestroy {
  stations: any[] = [];
  constructor(
    private api: ApiService,
    private router: Router,
  ) { }
  ngOnInit(): void {
   
    document.body.style.overflow = 'hidden';
    this.api.getStations().subscribe({
      next: (s) => (this.stations = s || []),
      error: (err) => console.error('Failed to load stations', err),
    });
  }
  ngOnDestroy(): void {
   
    document.body.style.overflow = '';
  }
}
