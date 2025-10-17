import { Component, OnInit } from '@angular/core';
import { Auth } from '../../services/auth';
import { JobService, Job } from '../../services/job';
import { MatDialog } from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { User } from '../../interfaces/user';
import { JobDialog } from '../../job-dialog/job-dialog';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatButtonModule,
  ]
})
export class Dashboard implements OnInit {

  user: User | null = null;
  jobs: Job[] = [];
  filterStatus: string | null = null;

  constructor(private auth: Auth, private jobService: JobService, private fb: FormBuilder, private dialog: MatDialog) { }

  ngOnInit() {
    this.auth.user$.subscribe(u => {
      this.user = u;
      if (u?.role === 'admin') {
        this.loadJobs();
        this.loadDrivers(); 
      } else if (u?.role === 'driver') {
        this.loadDriverJobs();
      }
    });
  }

  loadJobs(): void {
    this.jobService.listJobs(this.filterStatus || undefined).subscribe(jobs => this.jobs = jobs);
  }

  loadDriverJobs(): void {
    this.jobService.myJobs().subscribe(jobs => this.jobs = jobs);
  }

  applyFilter(status: string | null): void {
    this.filterStatus = status;
    this.loadJobs();
  }

  openJobDialog(job?: Job) {
    const dialogRef = this.dialog.open(JobDialog, {
      width: '400px',
      data: job || {}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (job) {
          this.jobService.updateJob(job.id, result).subscribe(() => this.loadJobs());
        } else {
          this.jobService.createJob(result).subscribe(() => this.loadJobs());
        }
      }
    });
  }

  deleteJob(job: Job) {
    if (confirm('Are you sure you want to delete this job?')) {
      this.jobService.deleteJob(job.id).subscribe(() => this.loadJobs());
    }
  }

  assignDriver(job: Job, driverId: number) {
    this.jobService.assignDriver(job.id, driverId).subscribe(() => this.loadJobs());
  }

  updateStatus(job: Job, status: Job['status']) {
    this.jobService.updateStatus(job.id, status).subscribe(() => this.loadDriverJobs());
  }

  drivers: User[] = [];

  loadDrivers(): void {
    this.jobService.getDrivers().subscribe(drivers => this.drivers = drivers);
  }

}
