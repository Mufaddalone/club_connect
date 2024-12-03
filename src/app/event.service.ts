import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Club } from './club.service';

export interface EventDTO {
  id: number;
  title: string;
  description: string;
  tags: string[];
  club?: { id: number; name?: string };
  attendees?: number[];  // Optional, simplified from Set<User>
  imageUrl?: string;     // Optional
}
@Injectable({
  providedIn: 'root'
})
export class EventService {
  private apiUrl = 'http://localhost:8080/api/events'; // Update if different

  constructor(private http: HttpClient) { }

  // Get all events with optional filtering parameters
  getEvents(params?: any): Observable<any> {
    let httpParams = new HttpParams();
  
    if (params) {
      for (const key in params) {
        if (params.hasOwnProperty(key) && params[key]) {
          httpParams = httpParams.append(key, params[key]);
        }
      }
    }
  
    return this.http.get<any>(this.apiUrl, { params: httpParams }).pipe(
      tap(data => console.log('Fetched Events (Raw JSON):', data))
    );
  }

  // Get a single event by ID
  getEventById(id: number): Observable<EventDTO> {
    return this.http.get<EventDTO>(`${this.apiUrl}/${id}`).pipe(
      tap(data => console.log(`Fetched Event ID=${id}:`, data))
    );
  }

  getClubbyID(clubId: number): Observable<Club> {
    return this.http.get<Club>(`http://localhost:8080/api/clubs/${clubId}`).pipe(
      tap(data => console.log(`Fetched Club with ID=${clubId}:`, data))
    );
  }

  getClubs(): Observable<Club[]> {
    return this.http.get<Club[]>(`http://localhost:8080/api/clubs`).pipe(
      tap(data => console.log(`Fetched Clubs:`, data))
    );
  }

  // Create a new event
  createEvent(event: EventDTO): Observable<EventDTO> {
    return this.http.post<EventDTO>(this.apiUrl, event).pipe(
      tap(data => console.log('Created Event:', data))
    );
  }

  subscribeToEvent(userId: string, subscriptionId: number, clubId: string, tags: string[]): Observable<string> {
    const subscriptionUrl = `http://localhost:8081/api/subscriptions/${userId}/${subscriptionId}`;
    const payload = { clubId, tags }; // Add clubId and tags to the payload
    return this.http.post(subscriptionUrl, payload, { responseType: 'text' }).pipe(
      tap(response => console.log(`API Response: ${response}`))
    );
  }

  // createSubscription(eventId: number): Observable<void> {

  // }

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