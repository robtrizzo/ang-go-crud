import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { User } from '../user';
import { UsersService } from '../users.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  template: `
    <p>
      home works!
    </p>
  `,
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  users: User[] = []
  usersService: UsersService = inject(UsersService)

  constructor() {
    this.usersService.getAllUsers().then(users => {
      this.users = users;
      console.log(this.users)
    })
  }
}
