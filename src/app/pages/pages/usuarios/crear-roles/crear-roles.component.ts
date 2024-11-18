import { ChangeDetectionStrategy, Component, Inject, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AngularMaterialModule } from 'src/app/material.module';
import { CrearUsuariosComponent } from '../crear-usuarios/crear-usuarios.component';
import { UsuariosService } from 'src/app/core/service/usuarios.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'vex-crear-roles',
  standalone: true,
  imports: [AngularMaterialModule],
  templateUrl: './crear-roles.component.html',
  changeDetection: ChangeDetectionStrategy.Default,
  styleUrl: './crear-roles.component.scss'
})
export class CrearRolesComponent implements OnInit, OnChanges {

  procesando = false;

  form = this.fb.group({
    codigo: [''],
    descripcion: [
      '',
    ],
    tipoPerfil: [''],
    idTipoPerfil: [0],
    idProducto: [1],
    idAplicacion: [1],
  });

  tiposPerfiles = [];

  constructor(
    @Inject(MAT_DIALOG_DATA) public rol: any | undefined,
    private dialogRef: MatDialogRef<CrearUsuariosComponent>,
    private usuariosService: UsuariosService,
    private fb: FormBuilder) {
    console.log(this.form.value);

  }


  ngOnChanges(changes: SimpleChanges): void {
    console.log(changes);

  }


  async ngOnInit() {
    if (this.rol) {
      this.form.patchValue({
        codigo: this.rol.codigo,
        descripcion: this.rol.descripcion,
        idTipoPerfil: this.rol.tipoPerfil.idTipoPerfil,
        tipoPerfil: this.rol.tipoPerfil.descripcion
      });
    }
    await this.usuariosService.obtenerTiposPerfiles().subscribe((data: any) => {
      this.tiposPerfiles = data;
    });
  }

  async crear() {
    if (this.procesando) return;
    this.procesando = true;
    await this.usuariosService.crearRol(this.form.value).subscribe((data: any) => {
      this.procesando = false;
      if (data.success) {
        Swal.fire({
          icon: 'success',
          title: '',
          text: 'Rol Creado con éxito',
          showConfirmButton: false,
          allowEscapeKey: false,
          allowOutsideClick: false,
          timer: 1500
        });
        this.dialogRef.close(data);
      }
    }, (error) => {
      this.procesando = false;
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: error.error.message,
      });
    });
  }
  async actualizar() {
    if (this.procesando) return;
    this.procesando = true;
    const actualizarRol = {
      "codigo": this.form.value.codigo,
      "descripcion": this.form.value.descripcion,
      "idTipoPerfil": this.form.value.idTipoPerfil,
      "idProducto": 1,
      "idAplicacion": 1
    }
    console.log(actualizarRol);

    await this.usuariosService.updateRol(this.rol.idPerfil, actualizarRol).subscribe((data: any) => {
      this.procesando = false;
      if (data.success) {
        Swal.fire({
          icon: 'success',
          title: 'Rol actualizado',
          showConfirmButton: false,
          allowEscapeKey: false,
          allowOutsideClick: false,
          timer: 1500
        });
        this.dialogRef.close(data);
      }
    }, (error) => {
      this.procesando = false;
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Hubo un error al actualizar el rol',
      });
    });
  }

  seleccionarTipoPerfil(tipoPerfil: any) {
    console.log(tipoPerfil);

    this.form.patchValue({ idTipoPerfil: tipoPerfil.idTipoPerfil });
  }


}
