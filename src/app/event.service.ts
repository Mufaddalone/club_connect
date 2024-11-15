import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

export interface EventDTO {
  id: number;
  title: string;
  description: string;
  date: string;
  location: string;
  category: string;
  tags: string[];
  club?: {         // Optional since it might be null
    id: number;
    name: string;
    description: string;
  };
  attendees?: number[];  // Optional, simplified from Set<User>
  // imageUrl?: string;  // Not in API
  // organizer?: {       // Not in API
  //   name: string;
  //   avatar: string;
  // };
}
@Injectable({
  providedIn: 'root'
})
export class EventService {
  private apiUrl = 'http://localhost:8080/api/events'; // Update if different

  constructor(private http: HttpClient) { }

  // Get all events with optional filtering parameters
  getEvents(params?: any): Observable<EventDTO[]> {
    let httpParams = new HttpParams();

    if (params) {
      for (const key in params) {
        if (params.hasOwnProperty(key) && params[key]) {
          httpParams = httpParams.append(key, params[key]);
        }
      }
    }

    return this.http.get<EventDTO[]>(this.apiUrl, { params: httpParams }).pipe(
      tap(data => console.log('Fetched Events:', data))
    );
  }

  // Get a single event by ID
  getEventById(id: number): Observable<EventDTO> {
    return this.http.get<EventDTO>(`${this.apiUrl}/${id}`).pipe(
      tap(data => console.log(`Fetched Event ID=${id}:`, data))
    );
  }

  // Create a new event
  createEvent(event: EventDTO): Observable<EventDTO> {
    return this.http.post<EventDTO>(this.apiUrl, event).pipe(
      tap(data => console.log('Created Event:', data))
    );
  }

  // Update an existing event
  updateEvent(event: EventDTO): Observable<EventDTO> {
    return this.http.put<EventDTO>(`${this.apiUrl}/${event.id}`, event).pipe(
      tap(data => console.log('Updated Event:', data))
    );
  }

  // Delete an event
  deleteEvent(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      tap(() => console.log(`Deleted Event ID=${id}`))
    );
  }
}