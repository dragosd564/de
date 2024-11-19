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

@Component({
  selector: 'vex-roles',
  standalone: true,
  imports: [AngularMaterialModule, TablaDinamicaComponent],
  animations: [fadeInUp400ms, stagger40ms, scaleIn400ms, fadeInRight400ms],
  templateUrl: './roles.component.html',
  styleUrl: './roles.component.scss'
})
export class RolesComponent implements OnInit {

  isloading = false;

  roles = [];

  columns: TableColumn<any>[] = [
    {
      label: 'Rol',
      property: 'descripcion',
      type: 'text',
      visible: true,
      cssClasses: ['font-medium']
    },

    {
      label: 'Opciones',
      property: 'menu',
      type: 'button',
      cssClasses: ['text-secondary', 'w-10']
    }
  ];

  constructor(private dialog: MatDialog,
    private usuariosService: UsuariosService,
    private alertaService: AlertasService
  ) { }


  ngOnInit() {
    this.isloading = true;
    this.usuariosService.obtenerRoles().subscribe((data: any) => {
      this.isloading = false;
      this.roles = data;
    }, (error) => {
      this.isloading = false;
    });
  }

  crearRol() {
    this.dialog
      .open(CrearRolesComponent).afterClosed().subscribe((data: any) => {
        if (data) {
          this.roles = [];
          this.usuariosService.obtenerRoles().subscribe((data: any) => {
            this.roles = data;
          });
        }
      });
  }
  editarRol(role: any) {
    this.dialog
      .open(CrearRolesComponent, {
        data: role
      }).afterClosed().subscribe((data: any) => {
        if (data) {
          this.roles = [];
          this.usuariosService.obtenerRoles().subscribe((data: any) => {
            this.roles = data;
          });
        }
      });
  }

  eliminarRol(role: any) {
    this.alertaService.alertaConfirmacion('¿Está seguro de eliminar el rol?', 'warning')
      .then((result) => {
        if (result.isConfirmed) {
          this.usuariosService.deleteRol(role.idPerfil).subscribe((data: any) => {
            if (data.success) {
              this.roles = [];
              this.usuariosService.obtenerRoles().subscribe((data: any) => {
                this.roles = data;
              });
            }
          });
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



}
