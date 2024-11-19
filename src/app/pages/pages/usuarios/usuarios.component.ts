import { Component, CUSTOM_ELEMENTS_SCHEMA, DestroyRef, inject, OnInit } from '@angular/core';
import { UntypedFormControl } from '@angular/forms';
import { AngularMaterialModule } from 'src/app/material.module';

import { TableColumn } from '@vex/interfaces/table-column.interface';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { aioTableData, aioTableLabels } from 'src/static-data/aio-table-data';
import { debounceTime, of } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { fadeInUp400ms } from '@vex/animations/fade-in-up.animation';
import { stagger40ms } from '@vex/animations/stagger.animation';
import { CrearUsuariosComponent } from './crear-usuarios/crear-usuarios.component';
import { Usuario } from 'src/app/core/interfaces/customer.model';
import { fadeInRight400ms } from '@vex/animations/fade-in-right.animation';
import { scaleIn400ms } from '@vex/animations/scale-in.animation';
import { TablaDinamicaComponent } from "../../../core/components/tabla-dinamica/tabla-dinamica.component";
import { CrearRolesComponent } from './crear-roles/crear-roles.component';
import { UsuariosService } from 'src/app/core/service/usuarios.service';
import Swal from 'sweetalert2';
import { AlertasService } from 'src/app/core/service/alertas.service';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.scss'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  animations: [fadeInUp400ms, stagger40ms, scaleIn400ms, fadeInRight400ms],
  standalone: true,
  imports: [
    AngularMaterialModule,
    TablaDinamicaComponent
  ]
})
export class UsuariosComponent implements OnInit {

  isloading = false;

  layoutCtrl = new UntypedFormControl('boxed');

  menuOpen = false;

  usuarios: Usuario[] = [];

  columns: TableColumn<Usuario>[] = [
    { label: '', property: 'foto', type: 'image', visible: true },
    {
      label: 'USUARIO',
      property: 'nombre',
      type: 'text',
      visible: true,
      cssClasses: ['font-medium']
    },
    {
      label: 'CORREO',
      property: 'correo',
      type: 'text',
      visible: true,
      cssClasses: ['text-secondary', 'font-medium']
    },
    {
      label: 'ROL',
      property: 'roles',
      type: 'text',
      visible: true,
      cssClasses: ['text-secondary', 'font-medium']
    },
    {
      label: '',
      property: 'menu',
      type: 'button',
      cssClasses: ['text-secondary', 'w-10']
    }
  ];
  pageSize = 10;
  pageSizeOptions: number[] = [5, 10, 20, 50];
  dataSource!: MatTableDataSource<Usuario>;
  searchCtrl = new UntypedFormControl();
  searchStr$ = this.searchCtrl.valueChanges.pipe(debounceTime(500));

  labels = aioTableLabels;

  private readonly destroyRef: DestroyRef = inject(DestroyRef);

  constructor(
    private dialog: MatDialog,
    private usuarioService: UsuariosService,
    private alertaService: AlertasService
  ) { }


  getData() {
    return of(aioTableData.map((customer) => new Usuario(customer)));
  }


  ngOnInit() {
    this.getUsuarios();
    this.searchCtrl.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((value) => { });
  }

  getUsuarios() {
    this.isloading = true;
    this.usuarios = [];
    this.dataSource = new MatTableDataSource(this.usuarios);
    this.usuarioService.obtenerUsuarios().subscribe((data: any) => {
      this.isloading = false;
      this.usuarios = data.result;
      this.dataSource = new MatTableDataSource(this.usuarios);
    }, (error) => {
      this.isloading = false;
    });
  }

  toggleColumnVisibility(column: TableColumn<Usuario>, event: Event) {
    event.stopPropagation();
    event.stopImmediatePropagation();
    column.visible = !column.visible;
  }
  trackByProperty<T>(index: number, column: TableColumn<T>) {
    return column.property;
  }

  crearUsuario() {
    this.dialog
      .open(CrearUsuariosComponent)
      .afterClosed()
      .subscribe((customer: Usuario) => {
        if (customer) {
          this.getUsuarios();
        }
      });
  }

  editarUsuario(customer: any) {
    this.dialog
      .open(CrearUsuariosComponent, {
        data: customer
      })
      .afterClosed()
      .subscribe((customer: any) => {
        if (customer) {
          this.getUsuarios();
        }
      });
  }

  eliminarUsuario(customer: any) {

    this.alertaService.alertaConfirmacion('¿Estás seguro?', '¡No podrás revertir esto!')
      .then((result) => {
        if (result.isConfirmed) {
          this.usuarioService.deleteUsuario(customer.idUsuario).subscribe((data: any) => {
            if (data.success) {
              this.alertaService.alertaExito('¡Eliminado!', 'El usuario ha sido eliminado.');
              this.getUsuarios();
            }

          }, (error) => {
            this.alertaService.alertaError('Error', 'Ha ocurrido un error al eliminar el usuario.');

          });
        }
      })
  }

  recibeData(data: any) {
    switch (data.accion) {
      case 'editar':
        this.editarUsuario(data);
        break;
      case 'eliminar':
        this.eliminarUsuario(data);
        break;
    }
  }

}
