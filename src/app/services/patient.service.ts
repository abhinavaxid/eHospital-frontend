import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Patient {
  patientId: number;
  patientName: string; // Matches API field
  patientAddress: string;
  patientAge: number;
  patientContact: string;
  patientGender: string;
  cardRegistrationDate: string;
  cardExpiryDate: string;
  ehealthFacilityId: number;
  createdIp: string;
}

@Injectable({ providedIn: 'root' })
export class PatientService {
  private baseUrl = 'http://localhost:8080/api/patients';

  constructor(private http: HttpClient) {}

  registerPatient(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/register`, data);
  }

  getAllPatients(): Observable<Patient[]> {
    return this.http.get<Patient[]>(`${this.baseUrl}/list`);
  }

  updatePatient(patient: Patient): Observable<any> {
    return this.http.put(`${this.baseUrl}/update`, patient);
  }
}