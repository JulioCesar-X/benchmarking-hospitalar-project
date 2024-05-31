import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  //exemplo basico de como fazer request á API atraves do servico
  private usersUrl = 'https://benchmarking-hospitalar-project.onrender.com/admin/users';

  constructor(private http: HttpClient) { }

  getUsers() {
    return this.http.get<any>(this.usersUrl);
  }
}
