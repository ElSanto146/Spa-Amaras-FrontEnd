import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { LoginServiceService } from '../login.service.service';

@Injectable({
  providedIn: 'root'
})
export class JwtInterceptorService implements HttpInterceptor {

  constructor(private LoginService: LoginServiceService) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = localStorage.getItem('token'); // 🔥 Obtiene el token JWT

    if (token && token.trim().length > 0 ) {
      req = req.clone({
        setHeaders: {
          'Content-Type': 'application/json; charsets=UTF-8',
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
       }
      )
    }
    return next.handle(req);
  }
}
