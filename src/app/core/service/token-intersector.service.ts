import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, Observable, throwError } from 'rxjs';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class TokenIntersectorService implements HttpInterceptor {

  constructor(private router: Router) { }


  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = localStorage.getItem('token'); // O donde sea que almacenes tu token

    if (token) {

      const cloned = req.clone({
        headers: req.headers.set('Authorization', `Bearer ${token}`)
      });
      return next.handle(cloned).pipe(
        catchError((error) => {
          if (error.status === 401) {
            Swal.fire({
              title: 'Error',
              text: 'Tu sesión ha expirado',
              icon: 'error',
              confirmButtonText: 'Ok'
            }).then((result) => {
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
