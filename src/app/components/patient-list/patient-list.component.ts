import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { PatientService, Patient } from '@app/services/patient.service';
import { PatientEditDialogComponent } from '@app/components/patient-edit-dialog/patient-edit-dialog.component';

@Component({
  selector: 'app-patient-list',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatCardModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    FormsModule
  ],
  templateUrl: './patient-list.component.html',
  styleUrls: ['./patient-list.component.css'],
})
export class PatientListComponent implements OnInit {
  searchTerm: string = '';
  patients: Patient[] = [];
  allPatients: Patient[] = [];
  isLoading = true;

  displayedColumns: string[] = ['patientId', 'name', 'cardStatus', 'edit'];

  constructor(
    private patientService: PatientService,
    private dialog: MatDialog,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.patientService.getAllPatients().subscribe({
      next: (data) => {
        this.allPatients = data;
        this.patients = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Failed to fetch patients', err);
        this.isLoading = false;
      },
    });
  }

  applyFilter() {
    const term = this.searchTerm.toLowerCase().trim();
    if (term) {
      this.patients = this.allPatients.filter(
        (patient) =>
          (patient.patientId !== undefined && patient.patientId.toString().includes(term)) ||
          patient.patientName.toLowerCase().includes(term)
      );
    } else {
      this.patients = [...this.allPatients];
    }
  }

  isCardValid(cardDate: string): boolean {
    if (!cardDate) return false;
    const regDate = new Date(cardDate);
    const expiryDate = new Date(regDate);
    expiryDate.setMonth(expiryDate.getMonth() + 6);
    return expiryDate > new Date();
  }

  openEditDialog(patient: Patient) {
    const dialogRef = this.dialog.open(PatientEditDialogComponent, {
      width: '400px',
      data: { ...patient }
    });

    dialogRef.afterClosed().subscribe((updated) => {
      if (updated) {
        this.ngOnInit();
      }
    });
  }

  navigateToEdit(patientId: number) {
    this.router.navigate(['/patient-registration', patientId]);
  }
}