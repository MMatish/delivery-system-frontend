import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'job-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
  ],
  templateUrl: './job-dialog.html',
  styleUrls: ['./job-dialog.scss'],

})
export class JobDialog {
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<JobDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.form = this.fb.group({
      pickup_address: [data.pickup_address || '', Validators.required],
      delivery_address: [data.delivery_address || '', Validators.required],
      recipient_name: [data.recipient_name || '', Validators.required],
      recipient_phone: [data.recipient_phone || '', Validators.required],
    });
  }

  submit() {
    this.dialogRef.close(this.form.value);
  }
}
