import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { EMPTY, Observable, throwError } from 'rxjs';
import { AuthService } from 'src/app/auth.service';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {

  constructor(
    private authService : AuthService,
    private router: Router
  ) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    request = request.clone({
      setHeaders: {
        Authorization: `Bearer ${this.authService.getJwt()}`
      }
    });
    return next.handle(request).pipe(catchError((err: HttpErrorResponse) =>{
      if (err.status === 401 || err.status === 403) {
        this.router.navigateByUrl(`/login`);
        return EMPTY;
      }
      return throwError(err)
    }));
  }
}
