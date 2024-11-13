import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditUserComponent } from './edit-user.component';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { User, UserStatus } from '../user';
import { of, throwError } from 'rxjs';
import { UsersService } from '../users.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';


describe('EditUserComponent', () => {
  let component: EditUserComponent;
  let fixture: ComponentFixture<EditUserComponent>;
  let usersService: jasmine.SpyObj<UsersService>;

  const mockUser: User = { user_id: 1, user_name: 'testuser1', first_name: 'Test', last_name: 'User1', email: 'test1@example.com', user_status: UserStatus.Active, department: 'IT' };

  beforeEach(() => {
    const usersServiceSpy = jasmine.createSpyObj('UsersService', ['getUser', 'updateUser']);
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([
          { path: 'users/:id', component: EditUserComponent }
        ]),
        EditUserComponent, 
        RouterTestingModule,
        HttpClientTestingModule,
        BrowserAnimationsModule,
        ReactiveFormsModule
      ],
      providers: [
        { provide: UsersService, useValue: usersServiceSpy },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              params: {
                userId: 1
              },
            },
          },
        },
      ]
    });

    usersService = TestBed.inject(UsersService) as jasmine.SpyObj<UsersService>;
    usersService.getUser.and.returnValue(of(mockUser));

    fixture = TestBed.createComponent(EditUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch user on init', () => {
    expect(usersService.getUser).toHaveBeenCalledWith(1);
    expect(component.user).toEqual(mockUser);
  });

  it('should handle error when fetching user', () => {
    usersService.getUser.and.returnValue(throwError(() => new Error('user not found')));
    component.ngOnInit();
    expect(component.user).toBeUndefined();
  });

  it('should update user on form submit', () => {
    usersService.updateUser.and.returnValue(of('User updated successfully'));
    component.userForm.setValue({
      user_name: 'updateduser',
      first_name: 'Updated',
      last_name: 'User',
      email: 'updated@example.com',
      user_status: UserStatus.Active,
      department: 'HR'
    });
    component.onSubmit();
    expect(usersService.updateUser).toHaveBeenCalledWith(1, {
      user_name: 'updateduser',
      first_name: 'Updated',
      last_name: 'User',
      email: 'updated@example.com',
      user_status: UserStatus.Active,
      department: 'HR'
    });
  });

  it('should handle error when updating user', () => {
    usersService.updateUser.and.returnValue(throwError(() => new Error('Error updating user')));
    component.userForm.setValue({
      user_name: 'updateduser',
      first_name: 'Updated',
      last_name: 'User',
      email: 'updated@example.com',
      user_status: UserStatus.Active,
      department: 'HR'
    });
    component.onSubmit();
    expect(component.errorMessage).toBe('Error updating user: Error: Error updating user');
  });
});
