import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { PatientService, Patient } from '@app/services/patient.service'; // Import PatientService and Patient

@Component({
  selector: 'app-patient-edit-dialog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDialogModule,
  ],
  templateUrl: './patient-edit-dialog.component.html',
  styleUrls: ['./patient-edit-dialog.component.css']
})
export class PatientEditDialogComponent {
  patient: Patient;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: Patient,
    private dialogRef: MatDialogRef<PatientEditDialogComponent>,
    private patientService: PatientService // Inject PatientService
  ) {
    this.patient = { ...data }; // Clone the patient data
  }

  updatePatient() {
    this.patientService.updatePatient(this.patient).subscribe({
      next: () => {
        this.dialogRef.close(true); // Notify success
      },
      error: (err) => {
        console.error('Update failed:', err);
        alert('Failed to update patient.');
      }
    });
  }

  cancel() {
    this.dialogRef.close(false);
  }
}