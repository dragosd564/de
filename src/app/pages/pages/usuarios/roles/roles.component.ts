import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AngularMaterialModule } from 'src/app/material.module';
import { CrearRolesComponent } from '../crear-roles/crear-roles.component';
import { TablaDinamicaComponent } from 'src/app/core/components/tabla-dinamica/tabla-dinamica.component';
import { TableColumn } from '@vex/interfaces/table-column.interface';
import { UsuariosService } from 'src/app/core/service/usuarios.service';
import { fadeInRight400ms } from '@vex/animations/fade-in-right.animation';
import { fadeInUp400ms } from '@vex/animations/fade-in-up.animation';
import { scaleIn400ms } from '@vex/animations/scale-in.animation';
import { stagger40ms } from '@vex/animations/stagger.animation';
import Swal from 'sweetalert2';
import { AlertasService } from 'src/app/core/service/alertas.service';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { MatTableDataSource } from '@angular/material/table';
import { scaleFadeIn400ms } from '@vex/animations/scale-fade-in.animation';
import { CrearOpcionesPermisosComponent } from '../crear-opciones-permisos/crear-opciones-permisos.component';

@Component({
  selector: 'vex-roles',
  standalone: true,
  imports: [AngularMaterialModule],
  animations: [
    fadeInUp400ms,
    stagger40ms, scaleIn400ms,
    scaleFadeIn400ms,
    fadeInRight400ms,
    trigger('detailExpand', [
      state('collapsed,void', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
  templateUrl: './roles.component.html',
  styleUrl: './roles.component.scss'
})
export class RolesComponent implements OnInit {

  isloading = false;

  roles = [];

  dataSource = new MatTableDataSource();

  columnsToDisplay = ['rol'];
  columnsToDisplayWithExpand = [...this.columnsToDisplay, 'expand'];
  expandedElement: any | null = null;

  constructor(private dialog: MatDialog,
    private usuariosService: UsuariosService,
    private alertaService: AlertasService
  ) { }


  ngOnInit() {
    this.obtenerRoles();
  }

  obtenerRoles() {
    this.isloading = true;
    this.roles = [];
    this.dataSource.data = [];
    this.usuariosService.obtenerRoles().subscribe((data: any) => {
      this.isloading = false;
      this.roles = data.map((rol: any) => {
        return {
          idPerfil: rol.idPerfil,
          descripcion: rol.descripcion,
          detallePerfil: this.agruparPermisosPorOpcion(rol.detallePerfil.map((detalle: any) => {
            return {
              ...detalle,
            };
          }))
        };
      });
      this.dataSource.data = this.roles;

    }, (error) => {
      this.isloading = false;
    });
  }

  crearRol() {
    this.dialog
      .open(CrearRolesComponent).afterClosed().subscribe((data: any) => {
        if (data) {
          this.obtenerRoles();
        }
      });
  }
  editarRol(role: any) {
    this.dialog
      .open(CrearRolesComponent, {
        data: role
      }).afterClosed().subscribe((data: any) => {
        if (data) {
          this.obtenerRoles();
        }
      });
  }

  eliminarRol(role: any) {
    this.alertaService.alertaConfirmacion('¿Está seguro de eliminar el rol?', 'warning')
      .then((result) => {
        if (result.isConfirmed) {
          this.usuariosService.deleteRol(role.idPerfil).subscribe((data: any) => {
            if (data.success) {
              this.obtenerRoles();
            }
          });
        }
      });
  }

  crearPrermisos(role: any) {
    this.dialog.open(CrearOpcionesPermisosComponent, {
      data: {
        esEditar: false,
        rol: role
      }
    }).afterClosed().subscribe((data: any) => {
      if (data) {
        this.obtenerRoles();
      }
    });
  }

  editarPermisos(role: any) {
    this.dialog.open(CrearOpcionesPermisosComponent, {
      data: {
        esEditar: true,
        rol: role
      }
    }).afterClosed().subscribe((data: any) => {
      if (data) {
        this.obtenerRoles();
      }
    });
  }

  recibeData(data: any) {
    switch (data.accion) {
      case 'editar':
        this.editarRol(data);
        break;
      case 'eliminar':
        this.eliminarRol(data);
        break;
    }
  }

  toggleRow(row: any) {
    this.expandedElement = this.expandedElement === row ? null : row;
  }

  agruparPermisosPorOpcion(detallePerfil: any[]): any[] {
    const groupedDetalles = detallePerfil.reduce((acc: any, detalle: any) => {
      const opcion = detalle.opcion;
      if (!acc[opcion]) {
        acc[opcion] = {
          idDetallePerfil: detalle.idDetallePerfil,
          idPerfil: detalle.idPerfil,
          idOpcion: detalle.idOpcion,
          opcion: detalle.opcion,
          permisos: [],
          detallesCompletos: []
        };
      }
      acc[opcion].permisos.push(detalle.permisos);
      acc[opcion].detallesCompletos.push(detalle);
      return acc;
    }, {});

    return Object.values(groupedDetalles).map((detalle: any) => ({
      ...detalle,
      permisos: [...new Set(detalle.permisos)] // Eliminar duplicados si es necesario
    }))
  }
}
