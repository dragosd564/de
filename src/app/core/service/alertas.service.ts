import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class AlertasService {

  constructor() { }

  alertaError(titulo: string, mensaje: string) {
    return Swal.fire({
      icon: 'error',
      title: titulo,
      text: mensaje,
      showConfirmButton: false,
      timer: 1500
    });
  }

  alertaExito(titulo: string, mensaje: string) {
    return Swal.fire({
      icon: 'success',
      title: titulo,
      text: mensaje,
      showConfirmButton: false,
      timer: 1500

    });
  }

  alertaAdvertencia(titulo: string, mensaje: string) {
    return Swal.fire({
      icon: 'warning',
      title: titulo,
      text: mensaje,
      showConfirmButton: false,
      timer: 1500
    });
  }

  alertaInformacion(titulo: string, mensaje: string) {
    return Swal.fire({
      icon: 'info',
      title: titulo,
      text: mensaje,
      showConfirmButton: false,
      timer: 1500
    });
  }

  alertaConfirmacion(titulo: string, mensaje: string) {
    return Swal.fire({
      icon: 'question',
      title: titulo,
      text: mensaje,
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si',
      cancelButtonText: 'No'
    });
  }

  alertaDinamica(icono: any, titulo: string, mensaje: string) {
    return Swal.fire({
      title: titulo,
      text: mensaje,
      icon: icono,
      showConfirmButton: false,
      timer: 1500,
      timerProgressBar: true,
      allowEscapeKey: false,
      allowOutsideClick: false
    })
  }


}
