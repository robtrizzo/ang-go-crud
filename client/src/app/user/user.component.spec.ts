import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserComponent } from './user.component';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { User, UserStatus } from '../user';
import { of, throwError } from 'rxjs';
import { UsersService } from '../users.service';
import { ActivatedRoute } from '@angular/router';

describe('UserComponent', () => {
  let component: UserComponent;
  let fixture: ComponentFixture<UserComponent>;
  let usersService: jasmine.SpyObj<UsersService>;

  const mockUser: User = { user_id: 1, user_name: 'testuser1', first_name: 'Test', last_name: 'User1', email: 'test1@example.com', user_status: UserStatus.Active, department: 'IT' };

  beforeEach(() => {
    const usersServiceSpy = jasmine.createSpyObj('UsersService', ['getUser']);
    TestBed.configureTestingModule({
      imports: [
        UserComponent,
        RouterTestingModule,
        HttpClientTestingModule,
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
    
    fixture = TestBed.createComponent(UserComponent);
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
    usersService.getUser.and.returnValue(throwError(() => new Error('user not')));
    component.ngOnInit();
    expect(component.user).toBeUndefined();
  });
});
