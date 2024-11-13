import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { User, SubmitUser, validateSubmitUser } from './user';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  private base_url = 'http://localhost:1323/users'

  constructor(private http: HttpClient) {}


  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.base_url);
  }

  createUser(user: SubmitUser): Observable<String> {
    const errors = validateSubmitUser(user);
    if (errors.length > 0) {
      return throwError(() => new Error(errors.join(', ')));
    } else {
      return this.http.post<String>(this.base_url, user)
    }
  }
}
