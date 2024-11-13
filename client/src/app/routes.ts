import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { NewUserComponent } from './new-user/new-user.component';
import { UserComponent } from './user/user.component';

const routeConfig: Routes = [
    {
      path: '',
      component: HomeComponent,
      title: 'Home page'
    },
    {
      path: 'users/new',
      component: NewUserComponent,
      title: 'Create a User'
    },
    {
      path: 'users/:userId',
      component: UserComponent,
      title: 'User'
    },
  ];
  
  export default routeConfig;