// app.routes.ts
import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { ClubPagesComponent } from './club-pages/club-pages.component';
import { EventsComponent } from './events/events.component';
import { LoginComponent } from './login/login.component';
import { StudentRegisterComponent } from './register-student/register-student.component';

export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'club-pages', component: ClubPagesComponent }, // Club Pages route
  { path: 'events', component: EventsComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register-student', component: StudentRegisterComponent },
];