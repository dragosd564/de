import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsuariosService {

  url = 'http://209.151.154.226/api/auth'

  constructor(private http: HttpClient,) { }


  crearUsuario(usuario: any): Observable<any> {
    return this.http.post(this.url + '/register', usuario);
  }

  obtenerUsuarios(): Observable<any> {
    return this.http.get(this.url + '/users');
  }

  updateUsuario(idUsuario: string, usuario: any): Observable<any> {
    return this.http.put(this.url + `/users/modificar/${idUsuario}`, usuario);
  }

  deleteUsuario(idUsuario: string): Observable<any> {
    return this.http.delete(this.url + `/users/borrar/${idUsuario}`)
  }

  obtenerRoles(): Observable<any> {
    return this.http.get(this.url + '/roles').pipe(
      map((data: any) => data.result)
    );
  }

  obtenerPerfiles(): Observable<any> {
    return this.http.get(this.url + '/profiles');
  }

  obtenerTiposPerfiles(): Observable<any> {
    return this.http.get(this.url + '/roles/perfil-tipo').pipe(
      map((data: any) => data.result)
    );
  }

  crearRol(rol: any): Observable<any> {
    return this.http.post(this.url + '/roles/crear', rol);
  }

  updateRol(idRol: string, rol: any): Observable<any> {
    return this.http.put(this.url + `/roles/modificar/${idRol}`, rol);
  }
  deleteRol(idRol: string): Observable<any> {
    return this.http.delete(this.url + `/roles/borrar/${idRol}`)
  }

  getModulo(): Observable<any> {
    return this.http.get(this.url + '/module');
  }

  getOpciones(idModulo: any): Observable<any> {
    return this.http.get(this.url + `/option/${idModulo}`);
  }

  crearPermisos(id: any, permiso: any) {
    return this.http.post(this.url + `/roles/${id}/detail`, permiso);
  }

  deletePermiso(id: any) {
    return this.http.delete(this.url + `/roles/detail/${id}`)
  }

}
