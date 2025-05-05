import { Routes } from '@angular/router';
import { LoginComponent } from '@app/auth/login/login.component';
import { authGuard } from '@app/auth/auth.guard';
import { DashboardComponent } from '@app/dashboard/dashboard.component';
import { PatientRegistrationComponent } from '@app/components/patient-registration/patient-registration.component';
import { PatientListComponent } from '@app/components/patient-list/patient-list.component';
import { LayoutComponent } from './layout/layout.component';
import { MedicalAdmissionTicketComponent } from '@app/components/medical-admission-ticket/medical-admission-ticket.component';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },

  {
    path: '',
    component: LayoutComponent,
    canActivate: [authGuard],
    children: [
      { path: 'dashboard', component: DashboardComponent },
      { path: 'register-patient', component: PatientRegistrationComponent },
      { path: 'patients-list', component: PatientListComponent },
      {path: 'patient-registration/:patientId', component: PatientRegistrationComponent},
      { path: 'create-ticket', component: MedicalAdmissionTicketComponent }
    ]
  },
  { path: '**', redirectTo: 'dashboard' },

];
