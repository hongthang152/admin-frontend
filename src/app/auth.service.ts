import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private http: HttpClient
  ) { }

  getJwt() {
    return localStorage.getItem('jwt');
  }

  setJwt(val: string) {
    localStorage.setItem('jwt', val);
  }

  authenticate(username: string, password: string) {
    return this.http.post<any>(`${environment.backend}/login` ,{ username: username, password: password });
  }
}
