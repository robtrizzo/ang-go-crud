import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterModule, MatToolbarModule,
    MatButtonModule],
  template: `
  <main>
    <mat-toolbar color="primary">
        <button mat-button routerLink="/">Home</button>
      </mat-toolbar>
    <section class="content">
      <router-outlet></router-outlet>
    </section>
  </main>`,
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'users';
}
