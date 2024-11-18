export class Usuario {
  id: number;
  foto: string;
  nombre: string;
  apellido: string;
  role: string;
  ciudad: string;
  telefono: string;
  correo: string;
  opciones: any;

  constructor(customer: any) {
    this.id = customer.id;
    this.foto = customer.foto;
    this.nombre = customer.nombre;
    this.apellido = customer.apellido;
    this.role = customer.role;
    this.ciudad = customer.ciudad;
    this.telefono = customer.telefono;
    this.correo = customer.correo;
    this.opciones = customer.opciones;

  }

  get nombres() {
    let name = '';

    if (this.nombre && this.apellido) {
      name = this.nombre + ' ' + this.apellido;
    } else if (this.nombre) {
      name = this.nombre;
    } else if (this.apellido) {
      name = this.apellido;
    }

    return name;
  }

  set nombres(value) { }
}
