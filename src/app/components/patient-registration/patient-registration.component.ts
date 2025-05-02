import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { Router, ActivatedRoute } from '@angular/router';
import { PatientService, Patient } from '@app/services/patient.service';

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
  isEditMode = false;
  patientId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private patientService: PatientService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    // Check if in edit mode
    this.patientId = Number(this.route.snapshot.paramMap.get('patientId')) || null;
    this.isEditMode = !!this.patientId;

    // Initialize form
    this.registrationForm = this.fb.group({
      fullName: ['', Validators.required],
      age: ['', [Validators.required, Validators.min(0)]],
      gender: ['', Validators.required],
      contactNumber: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
      email: ['', Validators.email],
      address: [''],
      facilityId: ['', Validators.required],
      cardRegistrationDate: ['', Validators.required],
    });

    // Load facilities
    this.loadFacilities();

    // If in edit mode, load patient data
    if (this.isEditMode && this.patientId) {
      this.loadPatientData(this.patientId);
    } else {
      // Set default registration date for new patients
      const currentDate = new Date().toISOString().split('T')[0];
      this.registrationForm.patchValue({ cardRegistrationDate: currentDate });
    }
  }

  loadFacilities(): void {
    this.patientService.getFacilities().subscribe({
      next: (data) => {
        this.facilities = data.map(facility => ({
          id: facility.ehealthFacilityId,
          name: facility.ehealthFacilityName
        }));
      },
      error: (err) => console.error('Error loading facilities', err),
    });
  }

  loadPatientData(patientId: number): void {
    this.patientService.getPatientById(patientId).subscribe({
      next: (patient) => {
        this.registrationForm.patchValue({
          fullName: patient.patientName,
          age: patient.patientAge,
          gender: patient.patientGender,
          contactNumber: patient.patientContact,
          email: patient.email || '',
          address: patient.patientAddress,
          facilityId: patient.ehealthFacilityId,
          cardRegistrationDate: patient.cardRegistrationDate,
        });
      },
      error: (err) => {
        console.error('Error loading patient data', err);
        alert('Failed to load patient data.');
        this.router.navigate(['/patient-list']);
      },
    });
  }

  submitForm(): void {
    if (this.registrationForm.valid) {
      // Type the form value for better type safety
      const formValue = this.registrationForm.value as {
        fullName: string;
        age: number;
        gender: string;
        contactNumber: string;
        email?: string;
        address: string;
        facilityId: number;
        cardRegistrationDate: string;
      };

      // Base patient data
      const patientData: Patient = {
        patientName: formValue.fullName,
        patientAddress: formValue.address || '',
        patientAge: formValue.age,
        patientContact: formValue.contactNumber,
        patientGender: formValue.gender,
        cardRegistrationDate: formValue.cardRegistrationDate,
        cardExpiryDate: this.calculateExpiryDate(formValue.cardRegistrationDate),
        ehealthFacilityId: formValue.facilityId,
        createdIp: '127.0.0.1',
        email: formValue.email,
      };

      if (this.isEditMode && this.patientId) {
        // Add patientId for update
        patientData.patientId = this.patientId;
        this.patientService.updatePatient(patientData).subscribe({
          next: () => {
            alert('Patient Updated Successfully');
            this.router.navigate(['/patient-list']);
          },
          error: (err) => {
            console.error('Update failed', err);
            alert('Update Failed');
          },
        });
      } else {
        // Register new patient (patientId omitted)
        this.patientService.registerPatient(patientData).subscribe({
          next: () => {
            alert('Patient Registered Successfully');
            this.router.navigate(['/patient-list']);
          },
          error: (err) => {
            console.error('Registration failed', err);
            alert('Registration Failed');
          },
        });
      }
    } else {
      this.registrationForm.markAllAsTouched();
    }
  }

  calculateExpiryDate(registrationDate: string): string {
    const regDate = new Date(registrationDate);
    const expiryDate = new Date(regDate);
    expiryDate.setMonth(expiryDate.getMonth() + 6);
    return expiryDate.toISOString().split('T')[0];
  }
}