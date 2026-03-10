import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError, of } from 'rxjs';
import { catchError, tap, timeout } from 'rxjs/operators';
import { DepartureGroup, DepartureResponse, Vagon } from '../models';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private baseUrl = 'https://railway.stepprojects.ge/api';
  private vagonsCache: Vagon[] | null = null;

  constructor(private http: HttpClient) {}

  getStations(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/stations`).pipe(
      catchError(err => throwError(() => err))
    );
  }

  getDepartures(): Observable<DepartureGroup[]> {
    return this.http.get<DepartureGroup[]>(`${this.baseUrl}/departures`).pipe(
      catchError(err => throwError(() => err))
    );
  }

  getDeparture(from?: string, to?: string, date?: string): Observable<DepartureResponse> {
    return this.http.get<DepartureResponse>(`${this.baseUrl}/getdeparture`).pipe(
      catchError(err => throwError(() => err))
    );
  }

  getVagon(id: string): Observable<Vagon> {
    return this.http.get<Vagon>(`${this.baseUrl}/getvagon/${id}`).pipe(
      catchError(err => throwError(() => err))
    );
  }

  getVagons(): Observable<Vagon[]> {
    if (this.vagonsCache) {
      return of(this.vagonsCache);
    }
    return this.http.get<Vagon[]>(`${this.baseUrl}/vagons`).pipe(
      timeout(10000), 
      tap(data => this.vagonsCache = data),
      catchError(err => throwError(() => err))
    );
  }

  registerTicket(body: any): Observable<string> {
    return this.http.post(`${this.baseUrl}/tickets/register`, body, { responseType: 'text' }).pipe(
      catchError(err => throwError(() => err))
    );
  }

  checkStatus(ticketId: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/tickets/checkstatus/${ticketId}`).pipe(
      catchError(err => throwError(() => err))
    );
  }

  confirm(ticketId: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/tickets/confirm/${ticketId}`).pipe(
      catchError(err => throwError(() => err))
    );
  }

  cancel(ticketId: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/tickets/cancel/${ticketId}`).pipe(
      catchError(err => throwError(() => err))
    );
  }

  getSeat(seatId: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/seat/${seatId}`).pipe(
      catchError(err => throwError(() => err))
    );
  }
}
