import { ChangeDetectionStrategy, Component, Inject, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AngularMaterialModule } from 'src/app/material.module';
import { CrearUsuariosComponent } from '../crear-usuarios/crear-usuarios.component';
import { UsuariosService } from 'src/app/core/service/usuarios.service';
import Swal from 'sweetalert2';
import { AlertasService } from 'src/app/core/service/alertas.service';

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
    idTipoPerfil: [2],
    idProducto: [1],
    idAplicacion: [1],
  });

  tiposPerfiles = [];

  constructor(
    @Inject(MAT_DIALOG_DATA) public rol: any | undefined,
    private dialogRef: MatDialogRef<CrearUsuariosComponent>,
    private usuariosService: UsuariosService,
    private alertasService: AlertasService,
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
        idTipoPerfil: 2,
        tipoPerfil: this.rol.tipoPerfil.descripcion
      });
    }
  }

  async crear() {
    if (this.procesando) return;
    this.procesando = true;
    await this.usuariosService.crearRol(this.form.value).subscribe((data: any) => {
      this.procesando = false;
      if (data.success) {
        this.alertasService.alertaExito('', 'Rol Creado con éxito');
        this.dialogRef.close(data);
      }
    }, (error) => {
      this.procesando = false;
      this.alertasService.alertaError('Oops...', 'Hubo un error al crear el rol' + error.error.message);
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
        this.alertasService.alertaExito('', 'Rol Actualizado con éxito');
        this.dialogRef.close(data);
      }
    }, (error) => {
      this.procesando = false;
      this.alertasService.alertaError('Oops...', 'Hubo un error al actualizar el rol' + error.error.message);
    });
  }

  seleccionarTipoPerfil(tipoPerfil: any) {

    this.form.patchValue({ idTipoPerfil: tipoPerfil.idTipoPerfil });
  }


}
