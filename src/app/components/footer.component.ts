import { Component } from '@angular/core';
@Component({
  selector: 'app-footer',
  standalone: true,
  template: `
    <footer class="footer-bar">
      <div class="container-inner">
        <div class="copyright-badge" aria-hidden="true">© STEP RAILWAY</div>
        <div class="footer-social">
          <a href="https://facebook.com" target="_blank" rel="noopener">
            <i class="fa-brands fa-facebook"></i>
          </a>
          <a href="https://instagram.com" target="_blank" rel="noopener">
            <i class="fa-brands fa-instagram"></i>
          </a>
        </div>
      </div>
    </footer>
  `,
  styles: [
    `
     
      .footer-bar {
        background: #0f0f0f;
        border-top: 1px solid rgba(255, 255, 255, 0.05);
        padding: 1rem 0;
      }
      .container-inner {
        max-width: 100%;
        padding: 0 20px;
        color: #64748b;
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
      .copyright-badge {
        font-family: 'Inter', sans-serif;
        font-size: 0.8125rem;
        font-weight: 500;
        letter-spacing: 0.02em;
        color: #475569;
      }
      .footer-social {
        display: flex;
        gap: 14px;
        align-items: center;
      }
      .footer-social i {
        font-size: 20px;
        color: #475569;
        transition: color 0.2s ease, transform 0.2s ease;
      }
      .footer-social i:hover {
        color: #f97316;
        transform: scale(1.1);
      }
      @media (max-width: 640px) {
        .footer-bar { padding: 1.5rem 0; }
        .container-inner {
          flex-direction: column;
          gap: 1rem;
          text-align: center;
        }
      }
    `,
  ],
})
export class FooterComponent { }
