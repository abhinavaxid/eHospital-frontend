import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-medical-admission-ticket',
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
  templateUrl: './medical-admission-ticket.component.html',
  styleUrls: ['./medical-admission-ticket.component.css']
})
export class MedicalAdmissionTicketComponent implements OnInit {
  ticketForm!: FormGroup;
  facilities: any[] = [];
  doctors: any[] = [];
  beds: any[] = [];
  units: any[] = [];

  constructor(private fb: FormBuilder, private http: HttpClient) {}

  ngOnInit(): void {
    this.ticketForm = this.fb.group({
      patientId: [null, [Validators.required]],
      bedId: [null, Validators.required],
      doctorId: [null, Validators.required],
      unitId: [null, Validators.required],
      ehealthFacilityId: [null, Validators.required],
      ticketCreatedDate: [new Date(), Validators.required],
      ticketExpiryDate: [this.getExpiryDate()],
      provisionalDiagnosis: ['', Validators.required]
    });

    this.loadDropdownData();
  }

  getExpiryDate(): Date {
    const created = new Date();
    created.setDate(created.getDate() + 15);
    return created;
  }

  loadDropdownData(): void {
    this.http.get<any[]>('http://localhost:8080/api/facilities/list').subscribe(data => this.facilities = data);
    this.http.get<any[]>('http://localhost:8080/api/doctors/list').subscribe(data => this.doctors = data);
    this.http.get<any[]>('http://localhost:8080/api/units/list').subscribe(data => this.units = data);
    this.http.get<any[]>('http://localhost:8080/api/beds/list').subscribe(data => this.beds = data);
  }

  submit(): void {
    if (this.ticketForm.valid) {
      this.http.post('http://localhost:8080/api/tickets/create', this.ticketForm.value).subscribe({
        next: () => alert('Ticket created successfully'),
        error: err => alert('Failed to create ticket: ' + err.message)
      });
    }
  }
}
