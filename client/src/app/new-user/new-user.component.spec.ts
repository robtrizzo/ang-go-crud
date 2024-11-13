import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewUserComponent } from './new-user.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of, throwError } from 'rxjs';
import { UsersService } from '../users.service';

describe('NewUserComponent', () => {
  let component: NewUserComponent;
  let fixture: ComponentFixture<NewUserComponent>;
  let usersService: jasmine.SpyObj<UsersService>;

  beforeEach(() => {
    const usersServiceSpy = jasmine.createSpyObj('UsersService', ['createUser']);
    TestBed.configureTestingModule({
      imports: [
        NewUserComponent, 
        HttpClientTestingModule, 
        BrowserAnimationsModule,
        ReactiveFormsModule
      ],
      providers: [
        { provide: UsersService, useValue: usersServiceSpy },
      ]
    });

    usersService = TestBed.inject(UsersService) as jasmine.SpyObj<UsersService>;

    fixture = TestBed.createComponent(NewUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should create user on form submit', () => {
    usersService.createUser.and.returnValue(of('User created successfully'));
    component.userForm.setValue({
      user_name: 'createduser',
      first_name: 'created',
      last_name: 'user',
      email: 'created@example.com',
      department: 'HR'
    });
    component.onSubmit();
  });

  it('should handle error when creating user', () => {
    usersService.createUser.and.returnValue(throwError(() => new Error('Error creating user')));
    component.userForm.setValue({
      user_name: 'createduser',
      first_name: 'created',
      last_name: 'user',
      email: 'created@example.com',
      department: 'HR'
    });
    component.onSubmit();
    expect(component.errorMessage).toBe('Error creating user: Error: Error creating user');
  });
});
