import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ApiService } from '../services/api.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-payment',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <section class="payment-container" [formGroup]="form">
      <div class="card-wrapper">
        <div class="flip-card" [class.flipped]="isFlipped">
          <div class="flip-card-inner">
            <div class="flip-card-front" (click)="isFlipped = true">
              <p class="heading_8264">MASTERCARD</p>
              <svg class="logo" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="48" height="48" viewBox="0 0 48 48">
                <path fill="#ff9800" d="M32 10A14 14 0 1 0 32 38A14 14 0 1 0 32 10Z"></path>
                <path fill="#d50000" d="M16 10A14 14 0 1 0 16 38A14 14 0 1 0 16 10Z"></path>
                <path fill="#ff3d00" d="M18,24c0,4.755,2.376,8.95,6,11.48c3.624-2.53,6-6.725,6-11.48s-2.376-8.95-6-11.48 C20.376,15.05,18,19.245,18,24z"></path>
              </svg>
              <svg version="1.1" class="chip" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="40px" height="40px" viewBox="0 0 50 50" xml:space="preserve">
                <image id="image0" width="50" height="50" x="0" y="0" href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAMAAAAp4XiDAAAABGdBTUEAALGPC/xhBQAAACBjSFJN
              AAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAB6VBMVEUAAACNcTiVeUKVeUOY
              fEaafEeUeUSYfEWZfEaykleyklaXe0SWekSZZjOYfEWYe0WXfUWXe0WcgEicfkiXe0SVekSXekSW
              ekKYe0a9nF67m12ZfUWUeEaXfESVekOdgEmVeUWWekSniU+VeUKVeUOrjFKYfEWliE6WeESZe0GS
              e0WYfES7ml2Xe0WXeESUeEOWfEWcf0eWfESXe0SXfEWYekSVeUKXfEWxklawkVaZfEWWekOUekOW
              ekSYfESZe0eXekWYfEWZe0WZe0eVeUSWeETAnmDCoWLJpmbxy4P1zoXwyoLIpWbjvXjivnjgu3bf
              u3beunWvkFWxkle/nmDivXiWekTnwXvkwHrCoWOuj1SXe0TEo2TDo2PlwHratnKZfEbQrWvPrWua
              fUfbt3PJp2agg0v0zYX0zYSfgkvKp2frxX7mwHrlv3rsxn/yzIPgvHfduXWXe0XuyIDzzISsjVO1
              lVm0lFitjVPzzIPqxX7duna0lVncuHTLqGjvyIHeuXXxyYGZfUayk1iyk1e2lln1zYTEomO2llrb
              tnOafkjFpGSbfkfZtXLhvHfkv3nqxH3mwXujhU3KqWizlFilh06khk2fgkqsjlPHpWXJp2erjVOh
              g0yWe0SliE+XekShhEvAn2D///+gx8TWAAAARnRSTlMACVCTtsRl7Pv7+vxkBab7pZv5+ZlL/UnU
              /f3SJCVe+Fx39naA9/75XSMh0/3SSkia+pil/KRj7Pr662JPkrbP7OLQ0JFOijI1MwAAAAFiS0dE
              orDd34wAAAAJcEhZcwAACxMAAAsTAQCanBgAAAAHdElNRQfnAg0IDx2lsiuJAAACLElEQVRIx2Ng
              GAXkAUYmZhZWPICFmYkRVQcbOwenmzse4MbFzc6DpIGXj8PD04sA8PbhF+CFaxEU8iWkAQT8hEVg
              OkTF/InR4eUVICYO1SIhCRMLDAoKDvFDVhUaEhwUFAjjSUlDdMiEhcOEItzdI6OiYxA6YqODIt3d
              I2DcuDBZsBY5eVTr4xMSYcyk5BRUOXkFsBZFJTQnp6alQxgZmVloUkrKYC0qqmji2WE5EEZuWB6a
              lKoKdi35YQUQRkFYPpFaCouKIYzi6EDitJSUlsGY5RWVRGjJLyxNy4ZxqtIqqvOxaVELQwZFZdkI
              JVU1RSiSalAt6rUwUBdWG1CP6pT6gNqwOrgCdQyHNYR5YQFhDXj8MiK1IAeyN6aORiyBjByVTc0F
              qBoKWpqwRCVSgilOaY2OaUPw29qjOzqLvTAchpos47u6EZyYnngUSRwpuTe6D+6qaFQdOPNLRzOM
              1dzhRZyW+CZouHk3dWLXglFcFIflQhj9YWjJGlZcaKAVSvjyPrRQ0oQVKDAQHlYFYUwIm4gqExGm
              BSkutaVQJeomwViTJqPK6OhCy2Q9sQBk8cY0DxjTJw0lAQWK6cOKfgNhpKK7ZMpUeF3jPa28BCET
              amiEqJKM+X1gxvWXpoUjVIVPnwErw71nmpgiqiQGBjNzbgs3j1nus+fMndc+Cwm0T52/oNR9lsdC
              S24ra7Tq1cbWjpXV3sHRCb1idXZ0sGdltXNxRateRwHRAACYHutzk/2I5QAAACV0RVh0ZGF0ZTpj
              cmVhdGUAMjAyMy0wMi0xM1QwODoxNToyOSswMDowMEUnN7UAAAAldEVYdGRhdGU6bW9kaWZ5ADIw
              MjMtMDItMTNUMDg6MTU6MjkrMDA6MDA0eo8JAAAAKHRFWHRkYXRlOnRpbWVzdGFtcAAyMDIzLTAy
              LTEzVDA4OjE1OjI5KzAwOjAwY2+u1gAAAABJRU5ErkJggg=="></image>
              </svg>
              <input class="number-input" formControlName="card" placeholder="**** **** **** ****" maxlength="16" inputmode="numeric" (click)="$event.stopPropagation()"/>
              
              <p class="valid_thru_label">VALID THRU</p>
              <input class="expiry-input" formControlName="expiry" placeholder="MM/YY" maxlength="5" (click)="$event.stopPropagation()" (input)="onExpiryInput($event)"/>
              
              <input class="name-input" formControlName="name" placeholder="CARDHOLDER NAME" (click)="$event.stopPropagation()"/>
            </div>
            <div class="flip-card-back" (click)="isFlipped = false">
              <div class="strip"></div>
              <div class="mstrip"></div>
              <div class="sstrip">
                <input class="cvv-input" formControlName="cvv" placeholder="***" maxlength="3" inputmode="numeric" (focus)="isFlipped = true" (click)="$event.stopPropagation()"/>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div class="actions">
        <button class="btn-flip" (click)="isFlipped = !isFlipped">Flip Card</button>
        <button class="btn-pay" (click)="submit()" [disabled]="form.invalid">Pay Now</button>
      </div>
    </section>
  `,
  styles: [`
    .payment-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 2.5rem;
      padding: 3rem;
      max-width: 600px;
      margin: 12rem auto 2rem auto;
      
      backdrop-filter: blur(15px);
      border-radius: 30px;
      color: white;
      
    }

    .card-wrapper {
      perspective: 1500px;
    }

    .flip-card {
      width: 480px;
      height: 300px;
      transition: transform 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275);
      transform-style: preserve-3d;
      cursor: pointer;
    }

    .flip-card.flipped {
      transform: rotateY(180deg);
    }

    .flip-card-inner {
      position: relative;
      width: 100%;
      height: 100%;
      transform-style: preserve-3d;
    }

    .flip-card-front, .flip-card-back {
      position: absolute;
      width: 100%;
      height: 100%;
      -webkit-backface-visibility: hidden;
      backface-visibility: hidden;
      border-radius: 1.5rem;
      box-shadow: 0 25px 50px rgba(0,0,0,0.6);
      background-color: #171717;
      overflow: hidden;
      border: 1px solid rgba(255, 255, 255, 0.1);
    }

    .flip-card-back {
      transform: rotateY(180deg);
      z-index: 1;
    }

    /* Input Styles on Card */
    input {
      background: transparent;
      border: none;
      color: white;
      font-family: 'Share Tech Mono', monospace;
      padding: 0.5rem;
      transition: all 0.3s;
      border-radius: 4px;
      box-sizing: border-box;
    }
    input:focus {
      outline: none;
      background: rgba(255, 255, 255, 0.1);
      box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.2);
    }
    input::placeholder {
      color: rgba(255, 255, 255, 0.3);
    }

    /* Card Front Layout */
    .heading_8264 { position: absolute; top: 2rem; right: 2.5rem; letter-spacing: .3em; font-size: 0.8em; margin: 0; opacity: 0.8; }
    .logo { position: absolute; bottom: 2.5rem; right: 2.5rem; }
    .chip { position: absolute; top: 2.5rem; left: 3rem; }
    
    .number-input { 
      position: absolute; 
      top: 52%; 
      left: 3rem; 
      width: 340px;
      transform: translateY(-50%); 
      font-size: 1.7rem; 
      font-weight: bold; 
      letter-spacing: 2px;
      text-align: left;
    }
    
    .valid_thru_label { 
      position: absolute; 
      bottom: 5.5rem; 
      left: 3rem; 
      font-size: 0.5rem; 
      font-weight: bold; 
      opacity: 0.6; 
    }
    
    .expiry-input { 
      position: absolute; 
      bottom: 3.5rem; 
      left: 3rem; 
      width: 90px;
      font-size: 1.2rem; 
      font-weight: bold; 
    }
    
    .name-input { 
      position: absolute; 
      bottom: 2rem; 
      left: 3rem; 
      width: 65%;
      font-size: 1rem; 
      font-weight: bold; 
      text-transform: uppercase;
      letter-spacing: 1px;
    }

    /* Card Back Layout */
    .strip { position: absolute; top: 3.5rem; width: 100%; height: 60px; background: repeating-linear-gradient(45deg, #222, #222 10px, #111 10px, #111 20px); }
    .mstrip { position: absolute; top: 9rem; left: 2.5rem; width: 65%; height: 45px; background: rgba(255,255,255,0.9); border-radius: 6px; }
    .sstrip { position: absolute; top: 9rem; right: 2.5rem; width: 20%; height: 45px; background: white; border-radius: 6px; display: flex; align-items: center; justify-content: center; z-index: 10; }
    
    .cvv-input { 
      width: 100%;
      color: black; 
      font-weight: bold; 
      text-align: center;
      font-size: 1.2rem;
      letter-spacing: 3px;
    }

    /* Actions */
    .actions {
      display: flex;
      gap: 1.5rem;
      width: 100%;
      justify-content: center;
    }


    .name-input {
  bottom: 20px; /* Or any other suitable value */
}
    button {
      padding: 1rem 2.5rem;
      border-radius: 15px;
      font-weight: bold;
      font-size: 1.1rem;
      cursor: pointer;
      transition: all 0.3s;
      border: none;
    }

    .btn-flip {
      background: rgba(141, 141, 141, 1);
      color: white;
      border: 1px solid rgba(255, 255, 255, 0.2);
    }
    .btn-flip:hover {
      background: rgba(112, 112, 112, 1);
    }

    .btn-pay {
      background: #eb8525;
      color: white;
      box-shadow: 0 10px 20px rgba(235, 133, 37, 0.3);
    }
    .btn-pay:hover:not(:disabled) {
      background: #d3741d;
      transform: translateY(-3px);
      box-shadow: 0 15px 30px rgba(235, 133, 37, 0.4);
    }
    .btn-pay:disabled {
      opacity: 0.5;
      cursor: not-allowed;
      box-shadow: none;
    }
  `]
})
export class PaymentComponent {
  form = new FormGroup({
    card: new FormControl('', [Validators.required, Validators.pattern('^[0-9]{16}$')]),
    name: new FormControl('', Validators.required),
    expiry: new FormControl('', [Validators.required, Validators.pattern('^(0[1-9]|1[0-2])\\/([0-9]{2})$')]),
    cvv: new FormControl('', [Validators.required, Validators.pattern('^[0-9]{3}$')]),
  });

  isFlipped = false;
  ticketId: string | null = null;

  constructor(private api: ApiService, private route: ActivatedRoute, private router: Router) {
    this.ticketId = this.route.snapshot.paramMap.get('ticketId');
  }

  onExpiryInput(event: any) {
    let value = event.target.value.replace(/\D/g, '');
    if (value.length > 2) {
      value = value.substring(0, 2) + '/' + value.substring(2, 4);
    }
    this.form.patchValue({ expiry: value }, { emitEvent: false });
    event.target.value = value;
  }

  submit() {
    if (this.form.invalid) return;
    this.api.confirm(this.ticketId || '').subscribe(
      () => this.router.navigate(['/ticket', this.ticketId]),
      err => console.error('Payment failed', err)
    );
  }
}
