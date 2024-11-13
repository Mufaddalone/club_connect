import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

export interface Club {
  id: number;
  name: string;
  description: string;
  // category?: string; // Uncomment when backend provides this field
  // tags?: string[];   // Uncomment when backend provides this field
  // imageUrl?: string; // Uncomment when backend provides this field
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

  createClub(club: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, club);
  }
}
