import { AfterViewInit, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS, MatFormFieldDefaultOptions } from '@angular/material/form-field';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { fadeInUp400ms } from '@vex/animations/fade-in-up.animation';
import { scaleFadeIn400ms } from '@vex/animations/scale-fade-in.animation';
import { stagger20ms } from '@vex/animations/stagger.animation';
import { TableColumn } from '@vex/interfaces/table-column.interface';
import { AngularMaterialModule } from 'src/app/material.module';

@Component({
  selector: 'vex-tabla-dinamica',
  animations: [stagger20ms, fadeInUp400ms, scaleFadeIn400ms],
  standalone: true,
  imports: [
    AngularMaterialModule
  ],
  providers: [
    {
      provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
      useValue: {
        appearance: 'fill'
      } as MatFormFieldDefaultOptions
    }
  ],
  templateUrl: './tabla-dinamica.component.html',
  styleUrl: './tabla-dinamica.component.scss'
})
export class TablaDinamicaComponent<T>
  implements OnInit, OnChanges, AfterViewInit {

  @Input({ required: true }) data!: T[];
  @Input({ required: true }) columns!: TableColumn<T>[];
  @Input() resultadoText: string = 'No hay resultados';
  @Input() pageSize = 10;
  @Input() pageSizeOptions = [10, 20, 50];
  @Input() busquedaStr: string = '';
  @Input() loading: boolean = false;

  @Output() openData = new EventEmitter();

  visibleColumns: Array<keyof T | string> = [];
  dataSource = new MatTableDataSource<T>();

  @ViewChild(MatPaginator, { static: true }) paginator?: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort?: MatSort;

  constructor() { }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log('changes', changes);

    if (changes['columns']) {
      this.visibleColumns = this.columns.map((column) => column.property);
    }

    if (changes['data']) {
      this.dataSource.data = this.data;
    }

    if (changes['searchStr']) {
      this.dataSource.filter = (this.busquedaStr || '').trim().toLowerCase();
    }
  }

  ngAfterViewInit() {
    if (this.paginator) {
      this.dataSource.paginator = this.paginator;
    }
    if (this.sort) {
      this.dataSource.sort = this.sort;
    }
  }

  emitOpenData(data: T, accion: string) {
    const datos = { ...data, 'accion': accion };
    this.openData.emit(datos);
  }
}
