import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [CommonModule],
  template: `
    <p>
      user works!
    </p>
  `,
  styleUrls: ['./user.component.css']
})
export class UserComponent {

}
