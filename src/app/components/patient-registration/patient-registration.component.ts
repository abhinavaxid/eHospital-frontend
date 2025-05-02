import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { Router } from '@angular/router';

@Component({
  selector: 'app-patient-registration',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatCardModule
  ],
  templateUrl: './patient-registration.component.html',
  styleUrls: ['./patient-registration.component.css'],
})
export class PatientRegistrationComponent implements OnInit {
  registrationForm!: FormGroup;
  facilities: any[] = [];

  constructor(private fb: FormBuilder, private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    // Get current date in YYYY-MM-DD format
    const currentDate = new Date().toISOString().split('T')[0];

    this.registrationForm = this.fb.group({
      fullName: ['', Validators.required],
      age: ['', [Validators.required, Validators.min(0)]],
      gender: ['', Validators.required],
      contactNumber: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
      email: ['', Validators.email],
      address: [''],
      facilityId: ['', Validators.required],
      cardRegistrationDate: [currentDate, Validators.required],
    });

    this.loadFacilities();
  }

  loadFacilities(): void {
    this.http.get<any[]>('http://localhost:8080/api/facilities/list').subscribe({
      next: (data) => {
        console.log('Raw data from API:', data);
        this.facilities = data.map(facility => ({
          id: facility.ehealthFacilityId,
          name: facility.ehealthFacilityName
        }));
        console.log('Transformed facilities:', this.facilities);
      },
      error: (err) => console.error('Error loading facilities', err),
    });
  }

  submitForm(): void {
    if (this.registrationForm.valid) {
      // Map form fields to backend-expected field names
      const formData = {
        patientName: this.registrationForm.value.fullName,
        patientAddress: this.registrationForm.value.address,
        patientAge: this.registrationForm.value.age,
        patientContact: this.registrationForm.value.contactNumber,
        patientGender: this.registrationForm.value.gender,
        cardRegistrationDate: this.registrationForm.value.cardRegistrationDate,
        ehealthFacilityId: this.registrationForm.value.facilityId,
        createdIp: '127.0.0.1' // Hardcoded; adjust as needed
      };

      console.log('Form data being sent:', formData); // Debug log

      this.http.post('http://localhost:8080/api/patients/register', formData).subscribe({
        next: (res) => {
          alert('Patient Registered Successfully');
          this.router.navigate(['/dashboard']);
        },
        error: (err) => {
          console.error('Registration failed', err);
          alert('Registration Failed');
        },
      });
    } else {
      this.registrationForm.markAllAsTouched();
      console.log('Form invalid:', this.registrationForm.errors); // Debug log
    }
  }
}