import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormControl, Validators, FormsModule, FormGroup, FormBuilder, ReactiveFormsModule} from '@angular/forms';
import {NgIf} from '@angular/common';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-new-user',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatFormFieldModule, MatInputModule, FormsModule, ReactiveFormsModule, NgIf],
  template: `
  <mat-card class="user-input-card">
    <mat-card-title>
      <h2 class="user-input-card-title">Create New User</h2>
    </mat-card-title>
    <mat-card-content>
      <form [formGroup]="userForm" (ngSubmit)="onSubmit()" class="new-user-form">
        <mat-form-field>
          <mat-label>Username</mat-label>
          <input matInput placeholder="thebatman" formControlName="user_name" required>
          <mat-error *ngIf="userForm.get('user_name')?.hasError('required')">
            Username is required
          </mat-error>
        </mat-form-field>
        <mat-form-field>
          <mat-label>First Name</mat-label>
          <input matInput placeholder="Bruce" formControlName="first_name">
        </mat-form-field>
        <mat-form-field>
          <mat-label>Last Name</mat-label>
          <input matInput placeholder="Wayne" formControlName="last_name">
        </mat-form-field>
        <mat-form-field>
          <mat-label>Email</mat-label>
          <input matInput placeholder="bruce@notbatman.com" formControlName="email">
          <mat-error *ngIf="userForm.get('email')?.hasError('email')">
              Please enter a valid email address
            </mat-error>
        </mat-form-field>
        <mat-form-field>
          <mat-label>Department</mat-label>
          <input matInput placeholder="Philantropy" formControlName="department">
        </mat-form-field>
        <button mat-raised-button color="primary" type="submit" [disabled]="userForm.invalid">Submit</button>
      </form>
    </mat-card-content>
  </mat-card>
  `,
  styleUrls: ['./new-user.component.css']
})
export class NewUserComponent {
  userForm: FormGroup;

  email = new FormControl('', [Validators.required, Validators.email]);

  constructor(private fb: FormBuilder) {
    this.userForm = this.fb.group({
      user_name: ['', Validators.required],
      first_name: [''],
      last_name: [''],
      email: ['', [Validators.email]],
      department: ['']
    });
  }

  getErrorMessage() {
    if (this.email.hasError('required')) {
      return 'You must enter a value';
    }

    return this.email.hasError('email') ? 'Not a valid email' : '';
  }

  onSubmit() {
    if (this.userForm.valid) {
      console.log('Form Submitted', this.userForm.value);
    }
  }
}
