export interface Station {
  id: string;
  name: string;
}

export interface Seat {
  seatId: string;
  number: string | number;
  price: number;
  isOccupied: boolean;
  vagonId: string;
}

export interface Vagon {
  id: string;
  trainId: number | string;
  trainNumber?: string;
  name?: string;
  seats: Seat[];
}

export interface Train {
  id: number | string;
  number?: string;
  name?: string;
  vagons?: Vagon[];
}

/** Shape of each object returned by GET /api/departures */
export interface DepartureGroup {
  id: number;
  source: string;
  destination: string;
  date: string;
  trains: TrainRaw[];
}

/** Raw train as nested inside DepartureGroup */
export interface TrainRaw {
  id: number;
  number: number;
  name: string;
  date: string;
  from: string;
  to: string;
  departure: string;
  arrive: string;   // API spells it "arrive", not "arrival"
  departureId: number;
  vagons: any;
}

/** Flat view model used in the UI */
export interface TrainView {
  id: number;
  number: number;
  name: string;
  from: string;
  to: string;
  date: string;
  departure: string;
  arrive: string;   // kept consistent with API field name
  departureId: number;
  vagons?: any;     // raw vagon/seat data preserved from API
}

export interface DepartureResponse {
  trains?: Train[];
  vagons?: Vagon[];
  [key: string]: any;
}

export interface RegisterTicketPerson {
  seatId: string;
  name: string;
  surname: string;
  idNumber: string;
  status: string;
  payedCompleted: boolean;
}

export interface RegisterTicketRequest {
  trainId: number | string;
  date: string;
  email: string;
  phoneNumber: string;
  people: RegisterTicketPerson[];
}

export interface Ticket {
  ticketId?: string;
  id?: string;
  status?: string;
  [key: string]: any;
}

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
}
