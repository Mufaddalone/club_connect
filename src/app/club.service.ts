import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

export interface Club {
  clubId: number; // Ensure this matches your data
  name: string;
  description: string;
  imageUrl?: string;
  eventIds?: any[];
}

@Injectable({
  providedIn: 'root'
})
export class ClubService {
  private apiUrl = 'http://localhost:8080/api/clubs'; // Update the URL if necessary

  constructor(private http: HttpClient) { }

  getClubs(params?: any): Observable<any[]> {
    let httpParams = new HttpParams();
  
    if (params) {
      for (const key in params) {
        if (params.hasOwnProperty(key)) {
          httpParams = httpParams.append(key, params[key]);
        }
      }
    }
  
    return this.http.get<any[]>(this.apiUrl, { params: httpParams }).pipe(
      tap(data => console.log(data))
    );
  }

  getClubById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  createClub(club: any): Observable<string> {
    return this.http.post(this.apiUrl, club, { responseType: 'text' });
  }

  createEvent(event: any): Observable<string> {
    return this.http.post('http://localhost:8080/api/events', event, { responseType: 'text' });
  }
}
