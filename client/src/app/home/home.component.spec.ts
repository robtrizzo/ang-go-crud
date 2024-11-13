import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeComponent } from './home.component';
import { User, UserStatus } from '../user';
import { UsersService } from '../users.service';
import { of } from 'rxjs';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let usersService: jasmine.SpyObj<UsersService>;

  const mockUsers: User[] = [
    { user_id: 1, user_name: 'testuser1', first_name: 'Test', last_name: 'User1', email: 'test1@example.com', user_status: UserStatus.Active, department: 'IT' },
    { user_id: 2, user_name: 'testuser2', first_name: 'Test', last_name: 'User2', email: 'test2@example.com', user_status: UserStatus.Inactive, department: 'HR' }
  ];

  beforeEach(async () => {
    const usersServiceSpy = jasmine.createSpyObj('UsersService', ['getAllUsers']);

    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        HttpClientTestingModule,
        HomeComponent
      ],
      providers: [
        { provide: UsersService, useValue: usersServiceSpy }
      ]
    }).compileComponents();

    usersService = TestBed.inject(UsersService) as jasmine.SpyObj<UsersService>;
    usersService.getAllUsers.and.returnValue(of(mockUsers));

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
