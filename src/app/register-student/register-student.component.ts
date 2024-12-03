import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { StudentAuthService, StudentRegisterRequest } from '../student-auth.service';

@Component({
  selector: 'app-student-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './register-student.component.html',
  styleUrls: ['./register-student.component.css']
})
export class StudentRegisterComponent {
  registerData: StudentRegisterRequest = {
    username: '',
    email: '',
    password: '',
    role: '',
  };

  errorMessage = '';
  isLoading = false;
  role: string = 'ROLE_USER'; // Default role is Student

  constructor(
    private studentAuthService: StudentAuthService,
    private router: Router
  ) {}

  // Set the role based on user selection
  setRole(role: string) {
    this.role = role;
  }

  onRegister() {
    this.isLoading = true;
    this.errorMessage = '';

    const request: StudentRegisterRequest = {
      username: this.registerData.username,
      email: this.registerData.email,
      password: this.registerData.password,
      role: this.role,
    };
    

    // Call appropriate API based on selected role
    if (this.role === 'ROLE_USER') {
      this.studentAuthService.registerStudent(request).subscribe({
        next: () => {
          alert('Student registration successful!');
          this.router.navigate(['/login']);
        },
        error: (error) => {
          this.errorMessage = error.error?.message || 'Student registration failed.';
          this.isLoading = false;
        },
        complete: () => {
          this.isLoading = false;
        }
      });
    } else if (this.role === 'ROLE_ADMIN') {
      this.studentAuthService.registerAdmin(request).subscribe({
        next: () => {
          alert('Admin registration successful!');
          this.router.navigate(['/login']);
        },
        error: (error) => {
          this.errorMessage = error.error?.message || 'Admin registration failed.';
          this.isLoading = false;
        },
        complete: () => {
          this.isLoading = false;
        }
      });
    }
  }
}