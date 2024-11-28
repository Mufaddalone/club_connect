import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // Required for [(ngModel)]
import { StudentAuthService, LoginRequest } from '../student-auth.service';

@Component({
  selector: 'app-login',
  standalone: true, // Declare as standalone
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  imports: [CommonModule, FormsModule, RouterModule], // Explicitly declare required modules
})
export class LoginComponent {
  loginRequest: LoginRequest = {
    username: '',
    password: '',
  };

  loginError = '';
  isLoading = false;
  role: string = 'ROLE_USER'; // Default role is Student

  constructor(
    private authService: StudentAuthService,
    private router: Router
  ) {}

  setRole(role: string) {
    this.role = role; // Set the selected role
  }

  onLogin() {
    this.isLoading = true;
    this.loginError = '';

    this.authService.login(this.loginRequest).subscribe({
      next: (response) => {
        // Store the token
        localStorage.setItem('authToken', response.token);

        // Redirect based on the selected role
        if (this.role === 'ROLE_USER') {
          this.router.navigate(['/events']);
        } else if (this.role === 'ROLE_ADMIN') {
          this.router.navigate(['/club-pages']);
        }
      },
      error: (error) => {
        this.loginError = error.error?.message || 'Login failed. Please try again.';
        this.isLoading = false;
      },
      complete: () => {
        this.isLoading = false;
      },
    });
  }
}