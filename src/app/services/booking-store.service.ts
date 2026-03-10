import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';

export interface BookingCriteria {
  from?: string;
  to?: string;
  date?: string;
}

export interface Passenger {
  name: string;
  phone: string;
  email: string;
  pid: string;
}

@Injectable({ providedIn: 'root' })
export class BookingStoreService {
  private searchCriteria: BookingCriteria = {};
  private selectedDeparture: any = null;
  private passengers: Passenger[] = [];
  private selectedSeats: string[] = [];
  private tickets: any[] = [];

  constructor(private auth: AuthService) {
    this.restoreFromStorage();
    // Re-load if user changes
    this.auth.currentUser$().subscribe(() => {
      this.restoreFromStorage();
    });
  }

  private getTicketsKey(): string {
    const rawUser = localStorage.getItem('currentUser');
    const u = rawUser ? JSON.parse(rawUser) : null;
    const userKey = u?.id || u?.email || 'guest';
    return `booking_tickets_${userKey}`;
  }

  private restoreFromStorage(): void {
    try {
      const ticketsKey = this.getTicketsKey();
      const raw = localStorage.getItem(ticketsKey);
      this.tickets = raw ? JSON.parse(raw) : [];

      const sc = localStorage.getItem('booking_search');
      if (sc) this.searchCriteria = JSON.parse(sc) || {};
      const sd = localStorage.getItem('booking_selectedDeparture');
      if (sd) this.selectedDeparture = JSON.parse(sd);
      const ss = localStorage.getItem('booking_selectedSeats');
      if (ss) this.selectedSeats = JSON.parse(ss) || [];
    } catch (e) {
      console.warn('Failed to restore booking store from localStorage', e);
    }
  }

  setSearchCriteria(criteria: BookingCriteria): void {
    this.searchCriteria = criteria;
    try { localStorage.setItem('booking_search', JSON.stringify(criteria)); } catch (e) { }
  }

  getSearchCriteria(): BookingCriteria {
    return this.searchCriteria;
  }

  setSelectedDeparture(departure: any): void {
    this.selectedDeparture = departure;
    try { localStorage.setItem('booking_selectedDeparture', JSON.stringify(departure)); } catch (e) { }
  }

  getSelectedDeparture(): any {
    return this.selectedDeparture;
  }

  setPassengers(passengers: Passenger[]): void {
    this.passengers = passengers;
  }

  getPassengers(): Passenger[] {
    return this.passengers;
  }

  setSelectedSeats(seats: string[]): void {
    this.selectedSeats = seats;
    try { localStorage.setItem('booking_selectedSeats', JSON.stringify(seats)); } catch (e) { }
  }

  getSelectedSeats(): string[] {
    return this.selectedSeats;
  }

  addTicket(ticket: any): void {
    
    const id = ticket?.ticketId || ticket?.id;
    if (this.tickets.find(t => (t.ticketId || t.id) === id)) return;

    this.tickets.push(ticket);
    this.saveTickets();
  }

  private saveTickets(): void {
    try {
      localStorage.setItem(this.getTicketsKey(), JSON.stringify(this.tickets));
    } catch (e) { }
  }

  getTickets(): any[] {
    return this.tickets;
  }

  clearBooking(): void {
    this.searchCriteria = {};
    this.selectedDeparture = null;
    this.passengers = [];
    this.selectedSeats = [];
  }
}
