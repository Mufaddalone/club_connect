import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface StudentRegisterRequest {
  username: string;
  email: string;
  password: string;
  role: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  message: string;
}

@Injectable({
  providedIn: 'root',
})
export class StudentAuthService {
  private apiUrl = 'http://localhost:8082/api/auth';

  constructor(private http: HttpClient) {}

  // Registration logic
  // registerStudent(request: StudentRegisterRequest): Observable<any> {
  //   const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
  //   return this.http.post(`${this.apiUrl}/register`, request, { headers, responseType: 'text' });
  // }

  registerStudent(request: StudentRegisterRequest): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, request, { responseType: 'text' });
  }

  registerAdmin(request: StudentRegisterRequest): Observable<any> {
    return this.http.post(`${this.apiUrl}/register-admin`, request,  { responseType: 'text' });
  }

  // Login logic
  login(request: LoginRequest): Observable<LoginResponse> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, request, { headers });
  }
}


// import { Injectable } from '@angular/core';
// import { HttpClient } from '@angular/common/http';
// import { catchError, Observable, tap } from 'rxjs';

// export interface LoginRequest {
//   username: string;
//   password: string;
// }

// export interface RegisterRequest {
//   username: string;
//   name?: string;  // Added for club/student name
//   email: string;
//   password: string;
//   description?: string;  // Optional for clubs   // Optional for students
// }

// export interface AuthResponse {
//   token: string;
// }

// @Injectable({
//   providedIn: 'root'
// })
// export class AuthService {
//   private apiUrl = 'http://localhost:8080/api/auth';

//   constructor(private http: HttpClient) { }

//   login(request: LoginRequest): Observable<AuthResponse> {
//     return this.http.post<AuthResponse>(`${this.apiUrl}/login`, request).pipe(
//       tap(response => {
//         // Store user role along with token
//         localStorage.setItem('token', response.token);
//         localStorage.setItem('username', request.username);
//       }),
//       catchError(error => {
//         console.error('Login error:', error);
//         if (error.status === 401) {
//           throw new Error('Invalid credentials');
//         }
//         throw new Error('Server error');
//       })
//     );
//   }

//   getUserRole(username: string): Observable<string> {
//     return this.http.get<string>(`${this.apiUrl}/role/${username}`);
//   }

//   registerStudent(request: RegisterRequest): Observable<any> {
//     return this.http.post(`${this.apiUrl}/register`, request);
//   }

//   registerClub(request: RegisterRequest): Observable<any> {
//     return this.http.post(`${this.apiUrl}/register-admin`, request);
//   }
// }