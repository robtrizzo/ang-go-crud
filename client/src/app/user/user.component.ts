import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { User } from '../user';

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section>
      <p>{{user.user_name}}</p>
  </section>
  `,
  styleUrls: ['./user.component.css']
})
export class UserComponent {
  @Input() user!: User
}
