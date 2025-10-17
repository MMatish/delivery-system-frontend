import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Config } from './config';
import { Observable } from 'rxjs';
import { User } from '../interfaces/user';

export interface Job {
  id: number;
  pickup_address: string;
  delivery_address: string;
  recipient_name: string;
  recipient_phone: string;
  status: 'assigned' | 'in_progress' | 'completed' | 'failed';
  driver?: { id: number; name: string; email: string };
}

@Injectable({
  providedIn: 'root'
})
export class JobService {
  private http = inject(HttpClient);
  private config = inject(Config);

  // Admin
  listJobs(status?: string): Observable<Job[]> {
    return this.http.get<Job[]>(`${this.config.apiUrl}/admin/jobs`, {
      params: status ? { status } : {},
      withCredentials: true
    });
  }

  createJob(data: Partial<Job>): Observable<Job> {
    return this.http.post<Job>(`${this.config.apiUrl}/admin/jobs`, data, { withCredentials: true });
  }

  updateJob(id: number, data: Partial<Job>): Observable<Job> {
    return this.http.put<Job>(`${this.config.apiUrl}/admin/jobs/${id}`, data, { withCredentials: true });
  }

  deleteJob(id: number): Observable<any> {
    return this.http.delete(`${this.config.apiUrl}/admin/jobs/${id}`, { withCredentials: true });
  }

  assignDriver(jobId: number, driverId: number): Observable<Job> {
    return this.http.post<Job>(`${this.config.apiUrl}/admin/jobs/${jobId}/assign`, { driver_id: driverId }, { withCredentials: true });
  }

  getDrivers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.config.apiUrl}/admin/drivers`);
  }


  // Driver
  myJobs(): Observable<Job[]> {
    return this.http.get<Job[]>(`${this.config.apiUrl}/driver/jobs`, { withCredentials: true });
  }

  updateStatus(jobId: number, status: Job['status']): Observable<Job> {
    return this.http.patch<Job>(`${this.config.apiUrl}/driver/jobs/${jobId}/status`, { status }, { withCredentials: true });
  }
  
}
