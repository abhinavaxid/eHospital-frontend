import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Patient {
  patientId?: number; // Made optional for registration
  patientName: string;
  patientAddress: string;
  patientAge: number;
  patientContact: string;
  patientGender: string;
  cardRegistrationDate: string;
  cardExpiryDate: string;
  ehealthFacilityId: number;
  createdIp: string;
  email?: string;
}

@Injectable({ providedIn: 'root' })
export class PatientService {
  private baseUrl = 'http://localhost:8080/api/patients';
  private facilityUrl = 'http://localhost:8080/api/facilities';

  constructor(private http: HttpClient) {}

  registerPatient(data: Patient): Observable<Patient> {
    return this.http.post<Patient>(`${this.baseUrl}/register`, data);
  }

  getAllPatients(): Observable<Patient[]> {
    return this.http.get<Patient[]>(`${this.baseUrl}/list`);
  }

  updatePatient(patient: Patient): Observable<Patient> {
    return this.http.put<Patient>(`${this.baseUrl}/update`, patient);
  }

  getPatientById(patientId: number): Observable<Patient> {
    return this.http.get<Patient>(`${this.baseUrl}/${patientId}`);
  }

  getFacilities(): Observable<any[]> {
    return this.http.get<any[]>(`${this.facilityUrl}/list`);
  }
}