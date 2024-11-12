import { Injectable } from '@angular/core';
import { User } from './user';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  constructor() { }

  base_url = 'http://localhost:1323/users'

  async getAllUsers(): Promise<User[]> {
    const data = await fetch(this.base_url)
    return await data.json() ?? [];
  }

}
