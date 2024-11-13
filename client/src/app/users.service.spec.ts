import { TestBed } from '@angular/core/testing';

import { UsersService } from './users.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { User, SubmitUser, UpdateUser, UserStatus } from './user';
import { __config } from 'src/config/config';

describe('UsersService', () => {
  let service: UsersService;
  let httpMock: HttpTestingController;

  const mockUsers: User[] = [
    { user_id: 1, user_name: 'testuser1', first_name: 'Test', last_name: 'User1', email: 'test1@example.com', user_status: UserStatus.Active, department: 'IT' },
    { user_id: 2, user_name: 'testuser2', first_name: 'Test', last_name: 'User2', email: 'test2@example.com', user_status: UserStatus.Inactive, department: 'HR' }
  ];

  const mockUser: User = { user_id: 1, user_name: 'testuser1', first_name: 'Test', last_name: 'User1', email: 'test1@example.com', user_status: UserStatus.Active, department: 'IT' };


  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });
    service = TestBed.inject(UsersService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch all users', () => {
    service.getAllUsers().subscribe(users => {
      expect(users).toEqual(mockUsers);
    });

    const req = httpMock.expectOne(__config.base_url);
    expect(req.request.method).toBe('GET');
    req.flush(mockUsers);
  });

  it('should create a user', () => {
    const newUser: SubmitUser = { user_name: 'newuser', first_name: 'New', last_name: 'User', email: 'new@example.com', department: 'Finance' };

    service.createUser(newUser).subscribe(response => {
      expect(response).toBe('User created successfully');
    });

    const req = httpMock.expectOne(__config.base_url);
    expect(req.request.method).toBe('POST');
    req.flush('User created successfully');
  });

  it('should fetch a user by ID', () => {
    service.getUser(1).subscribe(user => {
      expect(user).toEqual(mockUser);
    });

    const req = httpMock.expectOne(`${__config.base_url}/1`);
    expect(req.request.method).toBe('GET');
    req.flush(mockUser);
  });

  it('should update a user', () => {
    const updatedUser: UpdateUser = { user_name: 'updateduser', first_name: 'Updated', last_name: 'User', email: 'updated@example.com', user_status: UserStatus.Active, department: 'Finance' };

    service.updateUser(1, updatedUser).subscribe(response => {
      expect(response).toBe('User updated successfully');
    });

    const req = httpMock.expectOne(`${__config.base_url}/1`);
    expect(req.request.method).toBe('PUT');
    req.flush('User updated successfully');
  });

  it('should delete a user', () => {
    service.deleteUser(1).subscribe(response => {
      expect(response).toBe('User deleted successfully');
    });

    const req = httpMock.expectOne(`${__config.base_url}/1`);
    expect(req.request.method).toBe('DELETE');
    req.flush('User deleted successfully');
  });
});
