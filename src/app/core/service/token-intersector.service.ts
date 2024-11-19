import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, Observable, throwError } from 'rxjs';
import Swal from 'sweetalert2';
import { AlertasService } from './alertas.service';

@Injectable({
  providedIn: 'root'
})
export class TokenIntersectorService implements HttpInterceptor {

  constructor(private router: Router, private alertaService: AlertasService) { }


  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = localStorage.getItem('token'); // O donde sea que almacenes tu token

    if (token) {

      const cloned = req.clone({
        headers: req.headers.set('Authorization', `Bearer ${token}`)
      });
      return next.handle(cloned).pipe(
        catchError((error) => {
          if (error.status === 401) {
            this.alertaService.alertaInformacion('Tu sesión ha expirado', 'vuelve a iniciar sesión').then((result) => {
              if (result.isConfirmed) {
                localStorage.clear();
                this.router.navigate(['/login']);
              }
            });
          }
          return throwError(error);
        })
      );
    } else {
      return next.handle(req);
    }
  }

}
