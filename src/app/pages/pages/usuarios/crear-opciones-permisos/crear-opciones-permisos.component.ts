import { ChangeDetectionStrategy, Component, Inject, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AlertasService } from 'src/app/core/service/alertas.service';
import { UsuariosService } from 'src/app/core/service/usuarios.service';
import { AngularMaterialModule } from 'src/app/material.module';
import { CrearUsuariosComponent } from '../crear-usuarios/crear-usuarios.component';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'vex-crear-opciones-permisos',
  standalone: true,
  imports: [AngularMaterialModule],
  templateUrl: './crear-opciones-permisos.component.html',
  styleUrl: './crear-opciones-permisos.component.scss',
  changeDetection: ChangeDetectionStrategy.Default,
})
export class CrearOpcionesPermisosComponent implements OnInit, OnChanges {
  procesando = false
  mostrar = false;
  form = this.fb.group({
    idModulo: [0],
    modulos: [''],
    idOpcion: [0],
    opciones: [''],
    permisos: ['']
  });

  modulos = [];
  opciones = [];
  permisos = [
    'CARGAR',
    'MODIFICAR',
    'ELIMINAR',
  ]
  permisosDetalle: any[] = [];

  dataSource = new MatTableDataSource();

  displayedColumns: string[] = ['index', 'Descripcion', 'Opciones'];

  constructor(
    @Inject(MAT_DIALOG_DATA) public opcionesPermisos: any | undefined,
    private dialogRef: MatDialogRef<CrearOpcionesPermisosComponent>,
    private usuariosService: UsuariosService,
    private alertasService: AlertasService,
    private fb: FormBuilder) {
  }



  ngOnChanges(changes: SimpleChanges): void {
    console.log(changes);
  }

  async ngOnInit() {
    if (this.opcionesPermisos['esEditar']) {
      this.permisosDetalle = this.opcionesPermisos['rol']['detallesCompletos'].map((detalle: any, index: number) => {
        return {
          ...detalle,
          loading: false
        };
      });
      this.dataSource.data = this.permisosDetalle;
    }
    this.obtenerModulo()
  }

  obtenerModulo() {
    this.usuariosService.getModulo().subscribe((data: any) => {
      this.modulos = data.result;
    });
  }

  obtenerOpciones(idModulo: any) {
    this.usuariosService.getOpciones(idModulo).subscribe((data: any) => {
      this.opciones = data.result;
    });
  }

  selectOpt(opcion: any) {
    this.form.get('idOpcion')?.setValue(opcion['idOpcion'])
  }
  selectModulo(modulo: any) {
    this.form.get('idModulo')?.setValue(modulo['idModulo'])
    this.obtenerOpciones(modulo['idModulo'])
  }

  crearPermisos() {
    console.log(this.opcionesPermisos);
    const lista = this.opcionesPermisos['rol']['detallePerfil']

    if (
      !this.opcionesPermisos['esEditar'] &&
      lista.some((opcion: any) =>
        this.form.get('idOpcion')?.value === opcion.idOpcion &&
        opcion.permisos.some((permiso: any) => permiso === this.form.get('permisos')?.value))
    ) {
      this.alertasService.alertaAdvertencia('', 'La opción ya tiene el permiso seleccionado');
      return;
    }

    if (this.opcionesPermisos['esEditar'] &&
      this.opcionesPermisos['rol']['detallesCompletos'].some((opcion: any) =>
        this.form.get('idOpcion')?.value === opcion.idOpcion &&
        opcion.permisos === this.form.get('permisos')?.value)
    ) {
      this.alertasService.alertaAdvertencia('', 'La opción ya tiene el permiso seleccionado');
      return;
    }

    const datosEnvios =
      [
        {
          "idModulo": this.form.get('idModulo')?.value,
          "idOpcion": this.form.get('idOpcion')?.value,
          "permisos": this.form.get('permisos')?.value
        }
      ];
    this.procesando = true;
    this.usuariosService.crearPermisos(this.opcionesPermisos['rol']['idPerfil'], datosEnvios).subscribe((data: any) => {
      this.procesando = false;
      if (data.success) {
        this.alertasService.alertaExito('', 'Permisos creados correctamente');
        this.validar(data.result[0]);
      }
    }, (error) => {
      this.procesando = false;
      this.alertasService.alertaError('', error.error.message);
    });
  }

  validar(valor: any) {
    if (this.opcionesPermisos['esEditar']) {
      this.dataSource.data = [];
      this.permisosDetalle.push(valor);
      this.dataSource.data = this.permisosDetalle;
      this.mostrar = false;
      return
    }
    this.dialogRef.close(true);
  }

  eliminarPermiso(idDetallePerfil: any, index: number) {
    let id = idDetallePerfil['idDetallePerfil'];
    this.alertasService.alertaConfirmacion('Eliminar permiso', '¿Está seguro de eliminar el permiso?').then((data) => {
      if (data.isConfirmed) {
        this.eliminarPermisoConfirmado(id, index);
      }
    }, (error) => {
      this.procesando = false;
      (this.dataSource.data[index] as any)['loading'] = false;
      this.alertasService.alertaError('', error.error.message);
    });
  }

  eliminarPermisoConfirmado(id: any, index: number) {
    this.procesando = true;
    (this.dataSource.data[index] as any)['loading'] = true;
    this.usuariosService.deletePermiso(id).subscribe((data: any) => {
      this.procesando = false;
      (this.dataSource.data[index] as any)['loading'] = false;
      if (data.success) {
        this.alertasService.alertaExito('', 'Permiso eliminado correctamente');
        this.dialogRef.close(true);
      }
    }, (error) => {
      (this.dataSource.data[index] as any)['loading'] = false;
      this.procesando = false;
      this.alertasService.alertaError('', error.error.message);
    });
  }

  actualizarPermisos() { }

  limpiar() {
    this.mostrar = false;
    this.form.reset();

  }

}
