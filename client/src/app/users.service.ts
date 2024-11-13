import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from './user';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  private base_url = 'http://localhost:1323/users'

  constructor(private http: HttpClient) {}


  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.base_url);
  }

}
