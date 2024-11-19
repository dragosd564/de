import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Usuario } from 'src/app/core/interfaces/customer.model';
import { AlertasService } from 'src/app/core/service/alertas.service';
import { UsuariosService } from 'src/app/core/service/usuarios.service';
import { AngularMaterialModule } from 'src/app/material.module';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-crear-usuarios',
  templateUrl: './crear-usuarios.component.html',
  styleUrls: ['./crear-usuarios.component.scss'],
  standalone: true,
  imports: [
    AngularMaterialModule
  ]
})
export class CrearUsuariosComponent implements OnInit {

  isloading = false;
  showPassword = false;

  passwordRules = [
    { regex: /.{8,}/, label: 'Al menos 8 caracteres' },
    { regex: /[A-Z]/, label: 'Al menos una mayúscula' },
    { regex: /[a-z]/, label: 'Al menos una minúscula' },
    { regex: /[0-9]/, label: 'Al menos un número' },
    { regex: /[^A-Za-z0-9]/, label: 'Al menos un carácter especial' },
  ];

  form = this.fb.group({
    id: [this.usuario?.idUsuario || ''],
    nombre: [this.usuario?.nombre || ''],
    apellido: [this.usuario?.apellido || ''],
    role: [this.usuario?.roles[0] || ''],
    correo: [this.usuario?.inicioSesion || ''],
    opciones: [this.usuario?.opciones || ''],
    telefono: [this.usuario?.telefono || ''],
    inicioSesion: [this.usuario?.inicioSesion || ''],
    clave: ['', [Validators.required, Validators.minLength(8)]],
    idPerfil: [''],
    idLocal: [0],
    idEmpresa: [0],
  });

  mode: 'create' | 'update' = 'create';

  roles = []

  constructor(
    @Inject(MAT_DIALOG_DATA) public usuario: any | undefined,
    private dialogRef: MatDialogRef<CrearUsuariosComponent>,
    private fb: FormBuilder,
    private usuariosService: UsuariosService,
    private alertasService: AlertasService
  ) { }

  ngOnInit() {
    if (this.usuario) {
      this.mode = 'update';
      this.form.get('clave')?.clearValidators();
    } else {
      this.usuario = {};
    }

    this.obtenerRol();
    console.log(this.mode);

  }

  get password() {
    return this.form.get('clave');
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  getPasswordStrength(): number {
    const password = this.password?.value || '';
    return this.passwordRules.filter(rule => rule.regex.test(password)).length;
  }

  getStrengthColor(): string {
    const strength = this.getPasswordStrength();
    if (strength <= 2) return 'bg-red-500';
    if (strength <= 4) return 'bg-yellow-500';
    return 'bg-green-500';
  }

  getStrengthText(): string {
    const strength = this.getPasswordStrength();
    if (strength <= 2) return 'Débil';
    if (strength <= 4) return 'Moderada';
    return 'Fuerte';
  }

  isRuleMet(rule: { regex: RegExp; label: string }): boolean {
    return rule.regex.test(this.password?.value || '');
  }

  save() {
    if (this.mode === 'create') {
      this.crearUsuario();
    } else if (this.mode === 'update') {
      this.actualizarUsuario();
    }
  }

  crearUsuario() {
    if (this.form.valid && this.getPasswordStrength() === this.passwordRules.length) {
      this.isloading = true;
      const usuario = {
        "inicioSesion": this.form.value.correo,
        "identificacion": "0000000000",
        "nombres": this.form.value.nombre,
        "correo": this.form.value.correo,
        "celular": this.form.value.telefono,
        "foto": "",
        "clave": this.form.value.clave,
        "idPerfil": this.form.value.idPerfil,
      }
      this.usuariosService.crearUsuario(usuario).subscribe((data: any) => {
        this.isloading = false;
        this.alertasService.alertaExito('Usuario creado', 'El usuario se ha creado correctamente');
        this.dialogRef.close(data);
      }, (error) => {
        this.isloading = false;
        this.alertasService.alertaError('Error', error.error.message);
      });
    }
  }

  actualizarUsuario() {
    this.isloading = true;
    const usuario = {
      "identificacion": "",
      "ruc": "",
      "nombre": this.form.value.nombre,
      "correo": this.form.value.correo,
      "telefono": this.form.value.telefono,
      "foto": ""
    }
    this.usuariosService.updateUsuario(this.usuario.idUsuario, usuario).subscribe((data: any) => {
      this.isloading = false;
      this.alertasService.alertaExito('Usuario actualizado', 'El usuario se ha actualizado correctamente');
      this.dialogRef.close(data);
    }, (error) => {
      this.isloading = false;
      this.alertasService.alertaError('Error', error.error.message);
    });
  }

  isCreateMode() {
    return this.mode === 'create';
  }

  isUpdateMode() {
    return this.mode === 'update';
  }

  async obtenerRol() {
    await this.usuariosService.obtenerRoles().subscribe((data: any) => {
      this.roles = data;
    });
  }

  selectRol(rol: any) {
    this.form.get('idPerfil')?.setValue(rol.idPerfil);
  }
}
