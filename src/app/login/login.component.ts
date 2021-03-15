import { HttpErrorResponse } from '@angular/common/http';
import { ThisReceiver } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EMPTY } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from 'src/app/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  public username: string = '';
  public password: string = '';
  public error: string = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    // this.authService.
  }

  login() {
    this.authService.authenticate(this.username, this.password).pipe(
      catchError((error: HttpErrorResponse) => {
        this.error = 'Login failed. Please check your credentials';
        return EMPTY;
      })
    ).subscribe((data) => {
      localStorage.setItem('jwt', data.token);
      this.router.navigate(['dashboard']);
    })
  }

}
