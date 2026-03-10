import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-summary-sidebar',
  standalone: true,
  imports: [CommonModule],
  template: `
    <aside class="sidebar-container">
      <div class="receipt" *ngIf="data">
        <p class="shop-name">STEP RAILWAY</p>
        <div class="info">
          <div class="trip-info">
            <strong>{{data.departure?.from}} &rarr; {{data.departure?.to}}</strong>
          </div>
          <div>Train #{{data.departure?.number}}</div>
          <div>Date: {{data.departure?.date | date:'MM/dd/yyyy'}}</div>
          <div>Time: {{data.departure?.departure}}</div>
          <div class="qty-info">Qty: {{data.passengers?.length || 0}}</div>
        </div>

        <table>
          <thead>
            <tr>
              <th>Seat</th>
              <th class="text-right">Price</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let seat of data.seats">
              <td>{{seat}}</td>
              <td class="text-right">{{ (data.total / data.seats.length) | currency }}</td>
            </tr>
            <tr *ngIf="!data.seats?.length">
              <td colspan="2" class="text-muted text-center" style="font-size: 0.8rem; padding: 1rem 0;">No seats selected</td>
            </tr>
          </tbody>
        </table>

        <div class="total">
          <p>Total:</p>
          <p>{{data.total | currency}}</p>
        </div>

        <p class="thanks">Thank you for traveling with us!</p>
      </div>

      <div class="checkout-wrapper" 
           [class.disabled]="!canProceed || loading" 
           (click)="!canProceed || loading ? null : continue()">
        <div class="checkout-btn-container">
          <div class="left-side">
            <div class="card-icon">
              <div class="card-line"></div>
              <div class="buttons"></div>
            </div>
            <div class="post">
              <div class="post-line"></div>
              <div class="screen">
                <div class="dollar">$</div>
              </div>
              <div class="numbers"></div>
              <div class="numbers-line2"></div>
            </div>
          </div>
          <div class="right-side">
            <div class="new">{{ loading ? 'Processing...' : 'Checkout' }}</div>
          </div>
        </div>
      </div>
    </aside>
  `,
  styles: [
    `
    :host {
      display: block;
    }

    .sidebar-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      width: 100%;
    }

    /* Receipt Styles */
    .receipt {
      width: 100%;
      max-width: 320px;
      background: white;
      border: 2px dashed #cbd5e1;
      padding: 24px 20px;
      filter: drop-shadow(0 10px 15px rgba(0, 0, 0, 0.1)) drop-shadow(0 4px 6px rgba(0, 0, 0, 0.1));
      color: #1e293b;
      
      -webkit-mask-image: radial-gradient(circle at top left, transparent 15px, black 16px),
                          radial-gradient(circle at top right, transparent 15px, black 16px),
                          radial-gradient(circle at bottom right, transparent 15px, black 16px),
                          radial-gradient(circle at bottom left, transparent 15px, black 16px);
      -webkit-mask-size: 51% 51%;
      -webkit-mask-repeat: no-repeat;
      -webkit-mask-position: top left, top right, bottom right, bottom left;
      
      mask-image: radial-gradient(circle at top left, transparent 15px, black 16px),
                  radial-gradient(circle at top right, transparent 15px, black 16px),
                  radial-gradient(circle at bottom right, transparent 15px, black 16px),
                  radial-gradient(circle at bottom left, transparent 15px, black 16px);
      mask-size: 51% 51%;
      mask-repeat: no-repeat;
      mask-position: top left, top right, bottom right, bottom left;
    }

    .shop-name {
      font-family: 'Plus Jakarta Sans', sans-serif;
      font-size: 1.4rem;
      font-weight: 800;
      text-align: center;
      margin-bottom: 12px;
      color: #0f172a;
      letter-spacing: -0.02em;
    }

    .info {
      text-align: center;
      font-size: 0.9rem;
      margin-bottom: 20px;
      line-height: 1.5;
      color: #475569;
    }

    .trip-info {
      font-size: 1rem;
      color: #0f172a;
      margin-bottom: 4px;
    }

    .receipt table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 20px;
      font-size: 0.9rem;
    }

    .receipt table th,
    .receipt table td {
      padding: 8px 0;
      text-align: left;
      border-bottom: 1px solid #f1f5f9;
    }

    .receipt table th {
      color: #94a3b8;
      font-weight: 600;
      text-transform: uppercase;
      font-size: 0.75rem;
      letter-spacing: 0.05em;
    }

    .text-center { text-align: center !important; }
    .text-right { text-align: right !important; }

    .total {
      display: flex;
      justify-content: space-between;
      font-size: 1.1rem;
      font-weight: 700;
      margin-bottom: 20px;
      color: #0f172a;
      padding-top: 10px;
    }

    .thanks {
      font-size: 0.85rem;
      text-align: center;
      margin-top: 10px;
      color: #94a3b8;
      font-style: italic;
    }

    /* Checkout Button Positioning */
    .checkout-wrapper {
      margin-top: 10px; /* 10px gap as requested */
      display: flex;
      justify-content: center;
      cursor: pointer;
      transition: all 0.3s;
      width: 100%;
    }

    .checkout-wrapper.disabled {
      opacity: 0.5;
      filter: grayscale(1);
      cursor: not-allowed;
      pointer-events: none;
    }

    
    .checkout-btn-container {
      background-color: #ffffff;
      display: flex;
      width: 100%;
      max-width: 320px;
      height: 80px;
      position: relative;
      border-radius: 12px;
      transition: 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      border: 1px solid #e2e8f0;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
      overflow: hidden;
    }

    .checkout-btn-container:hover {
      transform: translateY(-2px);
      box-shadow: 0 12px 20px -8px rgba(0, 0, 0, 0.15);
    }

    .checkout-btn-container:hover .left-side {
      width: 100%;
    }

    .left-side {
      background-color: #10b981;
      width: 90px;
      height: 100%;
      position: relative;
      display: flex;
      justify-content: center;
      align-items: center;
      cursor: pointer;
      transition: 0.4s cubic-bezier(0.4, 0, 0.2, 1);
      flex-shrink: 0;
      overflow: hidden;
    }

    .right-side {
      display: flex;
      align-items: center;
      overflow: hidden;
      cursor: pointer;
      justify-content: center;
      white-space: nowrap;
      transition: 0.3s;
      flex-grow: 1;
    }

    .new {
      font-size: 1.1rem;
      font-family: 'Inter', sans-serif;
      font-weight: 700;
      color: #0f172a;
      letter-spacing: -0.01em;
    }

    /* Animated Card Icon */
    .card-icon {
      width: 50px;
      height: 34px;
      background-color: #d1fae5;
      border-radius: 4px;
      position: absolute;
      display: flex;
      z-index: 10;
      flex-direction: column;
      align-items: center;
      box-shadow: 0 4px 6px rgba(16, 185, 129, 0.2);
    }

    .card-line {
      width: 42px;
      height: 6px;
      background-color: #6ee7b7;
      border-radius: 1px;
      margin-top: 6px;
    }

    .buttons {
      width: 5px;
      height: 5px;
      background-color: #059669;
      box-shadow: 0 -6px 0 0 #059669, 0 6px 0 0 #34d399;
      border-radius: 50%;
      margin: 6px 0 0 -20px;
      transform: rotate(90deg);
    }

    .checkout-btn-container:hover .card-icon {
      animation: slide-top 1.2s cubic-bezier(0.645, 0.045, 0.355, 1) both;
    }

    .checkout-btn-container:hover .post {
      animation: slide-post 1s cubic-bezier(0.165, 0.84, 0.44, 1) both;
    }

    @keyframes slide-top {
      0% { transform: translateY(0); }
      50% { transform: translateY(-60px) rotate(90deg); }
      60% { transform: translateY(-60px) rotate(90deg); }
      100% { transform: translateY(-4px) rotate(90deg); }
    }

    .post {
      width: 50px;
      height: 60px;
      background-color: #f1f5f9;
      position: absolute;
      z-index: 11;
      top: 80px;
      border-radius: 6px;
      border: 1px solid #e2e8f0;
    }

    .post-line {
      width: 36px;
      height: 6px;
      background-color: #475569;
      position: absolute;
      border-radius: 0px 0px 2px 2px;
      right: 6px;
      top: 6px;
    }

    .screen {
      width: 36px;
      height: 18px;
      background-color: #ffffff;
      position: absolute;
      top: 16px;
      right: 6px;
      border-radius: 2px;
      border: 1px solid #e2e8f0;
    }

    .numbers {
      width: 8px;
      height: 8px;
      background-color: #94a3b8;
      box-shadow: 0 -12px 0 0 #94a3b8, 0 12px 0 0 #94a3b8;
      border-radius: 1px;
      position: absolute;
      transform: rotate(90deg);
      left: 18px;
      top: 40px;
    }

    .numbers-line2 {
      width: 8px;
      height: 8px;
      background-color: #cbd5e1;
      box-shadow: 0 -12px 0 0 #cbd5e1, 0 12px 0 0 #cbd5e1;
      border-radius: 1px;
      position: absolute;
      transform: rotate(90deg);
      left: 18px;
      top: 52px;
    }

    @keyframes slide-post {
      50% { transform: translateY(0); }
      100% { transform: translateY(-65px); }
    }

    .dollar {
      position: absolute;
      font-size: 12px;
      width: 100%;
      left: 0;
      top: 0;
      color: #10b981;
      font-weight: 800;
      text-align: center;
      line-height: 18px;
    }

    .checkout-btn-container:hover .dollar {
      animation: fade-in-fwd 0.3s 0.8s backwards;
    }

    @keyframes fade-in-fwd {
      0% { opacity: 0; transform: translateY(-5px); }
      100% { opacity: 1; transform: translateY(0); }
    }

    @media(max-width: 480px) {
      .receipt, .checkout-btn-container {
        max-width: 100%;
      }
    }
    `
  ]
})
export class SummarySidebarComponent {
  @Input() data: any;
  @Input() canProceed: boolean = true;
  @Input() loading: boolean = false;
  @Output() proceed = new EventEmitter<void>();
  continue() { this.proceed.emit(); }
}
