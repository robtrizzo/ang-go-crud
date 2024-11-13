import { Component, inject, OnInit } from '@angular/core';
import { CommonModule, NgIf } from '@angular/common';
import {FormControl, Validators, FormsModule, FormGroup, FormBuilder, ReactiveFormsModule} from '@angular/forms';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import {MatSelectModule} from '@angular/material/select';
import { UsersService } from '../users.service';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { Observer } from 'rxjs';
import { UpdateUser, UserStatus } from '../user';
import { HttpErrorResponse } from '@angular/common/http';
import { User } from '../user';

@Component({
  selector: 'app-edit-user',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatFormFieldModule, MatInputModule, FormsModule, ReactiveFormsModule, NgIf, MatSelectModule, RouterModule],
  template: `
    <mat-card class="user-card">
    <mat-card-title class="card-title">
      <h2>Edit User</h2>
      <h3>User ID: {{user.user_id}}</h3>
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
          <mat-label>User Status</mat-label>
          <mat-select formControlName="user_status">
            <mat-option value="A">
              Active
            </mat-option>
            <mat-option value="I">
              Inactive
            </mat-option>
            <mat-option value="T">
              Terminated
            </mat-option>
          </mat-select>
        </mat-form-field>
        <mat-form-field>
          <mat-label>Department</mat-label>
          <input matInput placeholder="Philantropy" formControlName="department">
        </mat-form-field>
        <button mat-raised-button color="primary" type="submit" [disabled]="userForm.invalid">Submit</button>
        <button mat-raised-button color="accent" type="submit" [routerLink]="['/users', user.user_id]" class="cx-btn">Cancel</button>
        <div *ngIf="errorMessage" class="error-message">{{ errorMessage }}</div>
      </form>
    </mat-card-content>
  </mat-card>
  `,
  styleUrls: ['./edit-user.component.css']
})
export class EditUserComponent implements OnInit{
  usersService: UsersService = inject(UsersService);
  router: Router = inject(Router);
  route: ActivatedRoute = inject(ActivatedRoute);
  userId;
  user: User = {
    user_id: 0,
    user_name: '',
  };
  
  userForm: FormGroup;
  errorMessage: string | null = null;
  
  email = new FormControl('', [Validators.required, Validators.email]);
  
  constructor(private fb: FormBuilder) {
    this.userId = Number(this.route.snapshot.params['userId']);
    this.userForm = this.fb.group({
      user_name: [undefined, Validators.required],
      first_name: [undefined],
      last_name: [undefined],
      email: [undefined, [Validators.email]],
      user_status: [UserStatus, Validators.required],
      department: [undefined]
    });
  }

  ngOnInit() {
    const userObserver: Observer<User> = {
      next: (user: User) => {
        this.user = user;
        this.userForm.patchValue(user)
      },
      error: (err: any) => {
        console.error('Error fetching user', err);
      },
      complete: () => {
        console.log('Users fetch complete');
      }
    };

    this.usersService.getUser(this.userId).subscribe(userObserver);
  }

  getErrorMessage() {
    if (this.email.hasError('required')) {
      return 'You must enter a value';
    }

    return this.email.hasError('email') ? 'Not a valid email' : '';
  }

  onSubmit() {
    if (this.userForm.valid) {
      const updateUserObserver: Observer<String> = {
        next: () => {
        },
        error: (err: any) => {
          console.error('Error updating user', err);
          // api response
          if (err instanceof HttpErrorResponse) { 
            this.errorMessage = 'Error updating user: ' + err.error;
          } else { 
            // client side validation error
            this.errorMessage = 'Error updating user: ' + err;
          }
        },
        complete: () => {
          console.log('User updated successfully');
          this.router.navigate(['/users', this.userId])
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
      const userToSubmit : UpdateUser = {
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
      if (this.userForm.value.user_status) {
        userToSubmit.user_status = this.userForm.value.user_status
      }
      if (this.userForm.value.department) {
        userToSubmit.department = this.userForm.value.department
      }
      this.usersService.updateUser(this.userId, userToSubmit).subscribe(updateUserObserver)
    }
  }
}
