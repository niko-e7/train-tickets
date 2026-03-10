import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home.component';
import { DeparturesComponent } from './pages/departures.component';
import { BookingComponent } from './pages/booking.component';
import { PaymentComponent } from './pages/payment.component';
import { TicketComponent } from './pages/ticket.component';
import { StatusComponent } from './pages/status.component';
import { AuthLoginComponent } from './pages/auth-login.component';
import { AuthSignupComponent } from './pages/auth-signup.component';
import { authGuard } from './services/auth.guard';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'departures', component: DeparturesComponent },
  { path: 'booking/:departureId', component: BookingComponent, canActivate: [authGuard] },
  { path: 'payment/:ticketId', component: PaymentComponent, canActivate: [authGuard] },
  { path: 'ticket/:ticketId', component: TicketComponent, canActivate: [authGuard] },
  { path: 'auth/login', component: AuthLoginComponent },
  { path: 'auth/signup', component: AuthSignupComponent },
  { path: 'status', component: StatusComponent },
  { path: '**', redirectTo: '' }
];
 
