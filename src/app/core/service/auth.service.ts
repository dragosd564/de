import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  url = 'https://localhost:44364'

  constructor(
    private http: HttpClient,
    private router: Router
  ) { }

  login(appData: any): Observable<any> {
    let authorizationData = 'Basic ' + btoa(appData.email + ':' + appData.password);
    const body = {
      "appId": "6DF1DB81-D305-4342-8C1F-282E2E5F9293",
      "deviceId": "1.1.1.1",
      "latitud": "0",
      "longitud": "0"
    };
    return this.http.post(this.url + '/login', body, {
      headers: {
        'Authorization': authorizationData,
        'Content-Type': 'application/json'
      }
    });
  }

  logout() {
    Swal.fire({
      title: '¿Estás seguro?',
      text: "Estas a punto de cerrar sesión",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, cerrar sesión'
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire(
          'Sesión cerrada',
          'Has cerrado sesión correctamente',
          'success'
        )
        localStorage.removeItem('token');
        this.router.navigate(['/login']);
      }
    })
    return;
  }

  userProfile(): Observable<any> {
    return this.http.get(this.url + '/profile')
  }
}
