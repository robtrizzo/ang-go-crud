import { Component, OnInit, inject, Inject } from '@angular/core';
import { CommonModule, NgIf } from '@angular/common';
import { User } from '../user';
import { UsersService } from '../users.service';
import { ActivatedRoute, RouterModule, Router } from '@angular/router';
import { Observer } from 'rxjs';
import { MatCardModule } from '@angular/material/card';
import {MatListModule} from '@angular/material/list';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatDialog, MAT_DIALOG_DATA, MatDialogRef, MatDialogModule} from '@angular/material/dialog';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatListModule, MatIconModule, MatButtonModule, RouterModule, MatDialogModule,],
  template: `
  <section>
    <mat-card class="user-card">
      <mat-card-title class="card-title">
        <h2>User: {{user.user_name}}</h2>
        <h3>User ID: {{user.user_id}}</h3>
      </mat-card-title>
      <mat-card-content>
        <mat-list role="list">
          <mat-list-item role="listitem"><b>First Name:</b> {{user.first_name}}</mat-list-item>
          <mat-list-item role="listitem"><b>Last Name:</b> {{user.last_name}}</mat-list-item>
          <mat-list-item role="listitem"><b>Email:</b> {{user.email}}</mat-list-item>
          <mat-list-item role="listitem"><b>Status:</b> {{user.user_status}}</mat-list-item>
          <mat-list-item role="listitem"><b>Department:</b> {{user.department}}</mat-list-item>
        </mat-list>
      </mat-card-content>
    </mat-card>
  </section>
  <section class="user-actions">
    <button mat-stroked-button color="primary" aria-label="edit user" [routerLink]="['/users', user.user_id, 'edit']">
      <mat-icon>edit</mat-icon> Edit User
    </button>
    <button mat-stroked-button color="warn" aria-label="delete user" (click)="openDialog()">
      <mat-icon>delete</mat-icon> Delete User
    </button>
  </section>
  `,
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {
  usersService: UsersService = inject(UsersService);
  route: ActivatedRoute = inject(ActivatedRoute);
  userId;
  user: User = {
    user_id: 0,
    user_name: '',
  };

  constructor(public dialog: MatDialog) {
    this.userId = Number(this.route.snapshot.params['userId']);
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(DeleteUserDialog, {
      data: {user_id: this.user.user_id, user_name: this.user.user_name},
    });

    // dialogRef.afterClosed().subscribe(result => {
    //   console.log('The dialog was closed');
    // });
  }

  ngOnInit() {
    const userObserver: Observer<User> = {
      next: (user: User) => {
        this.user = user;
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

}

interface DeleteDialogData {
  user_id: number;
  user_name: string;
}


@Component({
  imports: [CommonModule, MatDialogModule, MatButtonModule, NgIf],
  standalone: true,
  selector: 'delete-user-dialog',
  template:`
    <h1 mat-dialog-title>Are you sure you want to delete {{data.user_name}}?</h1>
    <div mat-dialog-content>
      <p>This cannot be reversed.</p>
      <div *ngIf="errorMessage" class="error-message">{{ errorMessage }}</div>
    </div>
    <div mat-dialog-actions>
      <button mat-button (click)="onNoClick()">No Thanks</button>
      <button mat-button (click)="onYesClick()" cdkFocusInitial>Ok</button>
    </div>
  `,
})
export class DeleteUserDialog {
  errorMessage: string | null = null;
  usersService: UsersService = inject(UsersService);
  constructor(
    public dialogRef: MatDialogRef<DeleteUserDialog>,
    @Inject(MAT_DIALOG_DATA) public data: DeleteDialogData,
    private router: Router
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

  onYesClick(): void {
    const deleteUserObserver: Observer<String> = {
      next: () => {
      },
      error: (err: any) => {
        console.error('Error deleting user', err);
        // api response
        if (err instanceof HttpErrorResponse) { 
          this.errorMessage = 'Error deleting user: ' + err.error;
        } else { 
          // client side validation error
          this.errorMessage = 'Error deleting user: ' + err;
        }
      },
      complete: () => {
        console.log('User deleted successfully');
        this.dialogRef.afterClosed().subscribe(() => {
          this.router.navigate(['/']);
        });
        this.dialogRef.close()
      }
    }
    this.usersService.deleteUser(this.data.user_id).subscribe(deleteUserObserver)
  }
}