import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { User } from '../user';
import { UsersService } from '../users.service';
import { MatButtonModule } from '@angular/material/button';
import {MatTableModule} from '@angular/material/table';
import { RouterModule, Router } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatTableModule,
    RouterModule
  ],
  template: `
    <section class="container">
     <table mat-table [dataSource]="users" class="mat-elevation-z8">
      <ng-container matColumnDef="user_id">
        <th mat-header-cell *matHeaderCellDef> UserID </th>
        <td mat-cell *matCellDef="let user"> {{user.user_id}} </td>
      </ng-container>
      <ng-container matColumnDef="user_name">
        <th mat-header-cell *matHeaderCellDef> Username </th>
        <td mat-cell *matCellDef="let user"> {{user.user_name}} </td>
      </ng-container>
      <ng-container matColumnDef="first_name">
        <th mat-header-cell *matHeaderCellDef> First Name </th>
        <td mat-cell *matCellDef="let user"> {{user.first_name}} </td>
      </ng-container>
      <ng-container matColumnDef="last_name">
        <th mat-header-cell *matHeaderCellDef> Last Name </th>
        <td mat-cell *matCellDef="let user"> {{user.last_name}} </td>
      </ng-container>
      <ng-container matColumnDef="email">
        <th mat-header-cell *matHeaderCellDef> Email </th>
        <td mat-cell *matCellDef="let user"> {{user.email}} </td>
      </ng-container>
      <ng-container matColumnDef="user_status">
        <th mat-header-cell *matHeaderCellDef> User Status </th>
        <td mat-cell *matCellDef="let user"> {{user.user_status}} </td>
      </ng-container>
      <ng-container matColumnDef="department">
        <th mat-header-cell *matHeaderCellDef> Department </th>
        <td mat-cell *matCellDef="let user"> {{user.department}} </td>
      </ng-container>
      <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
      <tr mat-row *matRowDef="let row; columns: displayedColumns;" (click)="navigateToUser(row)"></tr>
     </table>
     <button mat-stroked-button class="add-new-button" routerLink="/users/new">Add New User</button>
    </section>
  `,
  styleUrls: ['./home.component.css']
})
export class HomeComponent {

  usersService: UsersService = inject(UsersService);
  router: Router = inject(Router);

  users: User[] = [];
  displayedColumns: string[] = ["user_id", "user_name", "first_name", "last_name", "email", "user_status", "department" ]

  constructor() {
    this.usersService.getAllUsers().then(users => {
      this.users = users;
    });
  }

  navigateToUser(user: User) {
    this.router.navigate(['/users', user.user_id]);
  }
}