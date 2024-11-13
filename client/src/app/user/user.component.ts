import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { User } from '../user';
import { UsersService } from '../users.service';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Observer } from 'rxjs';
import { MatCardModule } from '@angular/material/card';
import {MatListModule} from '@angular/material/list';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatListModule, MatIconModule, MatButtonModule, RouterModule],
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
    <button mat-stroked-button color="warn" aria-label="delete user">
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

  constructor() {
    this.userId = Number(this.route.snapshot.params['userId']);
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
