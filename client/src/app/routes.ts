import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { NewUserComponent } from './new-user/new-user.component';
import { UserComponent } from './user/user.component';
import { EditUserComponent } from './edit-user/edit-user.component';

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
    {
      path: 'users/:userId/edit',
      component: EditUserComponent,
      title: 'Edit User'
    }
  ];
  
  export default routeConfig;