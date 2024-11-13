import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { User, SubmitUser, validateSubmitUser, UpdateUser, validateUpdateUser } from './user';
import { __config } from 'src/config/config';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  private base_url = __config.base_url

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

  getUser(userId: number): Observable<User> {
    return this.http.get<User>(`${this.base_url}/${userId}`)
  }

  updateUser(userId: number, user: UpdateUser): Observable<String> {
    const errors = validateUpdateUser(user);
    if (errors.length > 0) {
      return throwError(() => new Error(errors.join(', ')))
    } else {
      return this.http.put<String>((`${this.base_url}/${userId}`), user)
    }
  }

  deleteUser(userId: number): Observable<String> {
    return this.http.delete<String>(`${this.base_url}/${userId}`)
  }
}
