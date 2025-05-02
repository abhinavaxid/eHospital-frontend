import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Facility } from '../models/facility.model';

@Injectable({
  providedIn: 'root',
})
export class FacilityService {
  private readonly apiUrl = 'http://localhost:8080/api/facilities/list'; 

  constructor(private http: HttpClient) {}

  getFacilities(): Observable<Facility[]> {
    return this.http.get<Facility[]>(this.apiUrl);
  }
}
