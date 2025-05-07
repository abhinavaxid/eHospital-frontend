import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatButtonModule } from '@angular/material/button';

@Component({
  standalone: true,
  selector: 'app-medical-ticket-list',
  templateUrl: './medical-ticket-list.component.html',
  styleUrls: ['./medical-ticket-list.component.css'],
  imports: [CommonModule, MatCardModule, MatTableModule, MatSortModule, MatButtonModule],
})
export class MedicalTicketListComponent implements OnInit {
  dataSource: any[] = [];
  displayedColumns: string[] = [
    'patientId',
    'ehealthFacilityName',
    'doctorName',
    'unitName',
    'ticketCreatedDate',
    'ticketExpiryDate',
    'status'
  ];

  facilities: any[] = [];
  doctors: any[] = [];
  units: any[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadReferenceData().then(() => this.loadTickets());
  }

  async loadReferenceData() {
    const [facilitiesRes, doctorsRes, unitsRes] = await Promise.all([
      this.http.get<any[]>('http://localhost:8080/api/facilities/list').toPromise().then(res => res ?? []),
      this.http.get<any[]>('http://localhost:8080/api/doctors/list').toPromise().then(res => res ?? []),
      this.http.get<any[]>('http://localhost:8080/api/units/list').toPromise().then(res => res ?? []),
    ]);
  
    this.facilities = facilitiesRes;
    this.doctors = doctorsRes;
    this.units = unitsRes;
  }
  

  loadTickets() {
    this.http.get<any[]>('http://localhost:8080/api/tickets/list').subscribe(tickets => {
      this.dataSource = tickets.map(ticket => {
        const facility = this.facilities.find(f => f.ehealthFacilityId === ticket.ehealthFacilityId);
        const doctor = this.doctors.find(d => d.doctorId === ticket.doctorId);
        const unit = this.units.find(u => u.unitId === ticket.unitId);

        return {
          ...ticket,
          ehealthFacilityName: facility?.ehealthFacilityName || 'N/A',
          doctorName: doctor?.doctorName || 'N/A',
          unitName: unit?.unitName || 'N/A'
        };
      });
    });
  }

  isActive(expiryDate: string): boolean {
    return new Date(expiryDate) > new Date();
  }
}
