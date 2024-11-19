import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import Swal from 'sweetalert2';
import { AlertasService } from './alertas.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  url = 'https://localhost:44364'

  constructor(
    private http: HttpClient,
    private router: Router,
    private alertasService: AlertasService
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
    this.alertasService.alertaConfirmacion('Cerrar sesión', '¿Estás seguro de cerrar sesión?').then((result) => {
      if (result.isConfirmed) {
        this.alertasService.alertaDinamica('success', 'Sesión cerrada', 'Tu sesión ha sido cerrada');
        localStorage.clear();
        this.router.navigate(['/login']);
      }
    })
    return;
  }

  authEmail(): Observable<any> {
    return this.http.post(this.url + '/users/verify', {});
  }

  validarCodigo(codigo: any): Observable<any> {
    return this.http.get(this.url + `/users/verify/${codigo}`);
  }

  userProfile(): Observable<any> {
    return this.http.get(this.url + '/profile')
  }
}
