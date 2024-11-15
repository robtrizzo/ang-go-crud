import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormControl, Validators, FormsModule, FormGroup, FormBuilder, ReactiveFormsModule} from '@angular/forms';
import {NgIf} from '@angular/common';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { UsersService } from '../users.service';
import { Router } from '@angular/router';
import { Observer } from 'rxjs';
import { SubmitUser } from '../user';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-new-user',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatFormFieldModule, MatInputModule, FormsModule, ReactiveFormsModule, NgIf],
  template: `
  <mat-card class="user-card">
    <mat-card-title>
      <h2 class="card-title">Create New User</h2>
    </mat-card-title>
    <mat-card-content>
      <form [formGroup]="userForm" (ngSubmit)="onSubmit()" class="user-form">
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
        <div *ngIf="errorMessage" class="error-message">{{ errorMessage }}</div>
      </form>
    </mat-card-content>
  </mat-card>
  `,
  styleUrls: ['./new-user.component.css']
})
export class NewUserComponent {
  usersService: UsersService = inject(UsersService);
  router: Router = inject(Router);

  userForm: FormGroup;
  errorMessage: string | null = null;

  email = new FormControl('', [Validators.required, Validators.email]);

  constructor(private fb: FormBuilder) {
    this.userForm = this.fb.group({
      user_name: [undefined, Validators.required],
      first_name: [undefined],
      last_name: [undefined],
      email: [undefined, [Validators.email]],
      department: [undefined]
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
      const createUserObserver: Observer<String> = {
        next: () => {
        },
        error: (err: any) => {
          console.error('Error creating user', err);
          // api response
          if (err instanceof HttpErrorResponse) { 
            this.errorMessage = 'Error creating user: ' + err.error;
          } else { 
            // client side validation error
            this.errorMessage = 'Error creating user: ' + err;
          }
        },
        complete: () => {
          console.log('User created successfully');
          this.router.navigate(['/'])
        }
      };
      /**
       * userForm still includes each field as null
       * 
       * the api unmarshals null fields into empty strings, which can
       * then trip up the 'omitempty' conditions on the server side
       * validator
       * 
       * so this is a bit of a hack to only send fields with data
       */
      const userToSubmit : SubmitUser = {
        user_name: this.userForm.value.user_name
      }
      if (this.userForm.value.first_name) {
        userToSubmit.first_name = this.userForm.value.first_name
      }
      if (this.userForm.value.last_name) {
        userToSubmit.last_name = this.userForm.value.last_name
      }
      if (this.userForm.value.email) {
        userToSubmit.email = this.userForm.value.email
      }
      if (this.userForm.value.department) {
        userToSubmit.department = this.userForm.value.department
      }
      this.usersService.createUser(userToSubmit).subscribe(createUserObserver)
    }
  }
}