import { Injectable } from '@angular/core';
import { VexLayoutService } from '@vex/services/vex-layout.service';
import { NavigationItem, NavigationSubheading } from './navigation-item.interface';
import { BehaviorSubject, Observable } from 'rxjs';
import { AuthService } from '../service/auth.service';

@Injectable({
  providedIn: 'root'
})
export class NavigationLoaderService {

  private readonly _items: BehaviorSubject<NavigationItem[]> =
    new BehaviorSubject<NavigationItem[]>([]);

  private readonly _loadingsubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  private readonly _userInfo: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  get items$(): Observable<NavigationItem[]> {
    return this._items.asObservable();
  }

  get isLoaded$(): Observable<boolean> {
    return this._loadingsubject.asObservable();
  }
  get userInfo(): Observable<boolean> {
    return this._userInfo.asObservable();
  }

  constructor(private readonly layoutService: VexLayoutService, private authService: AuthService) {
  }

  loadNavigation(): void {
    this._loadingsubject.next(true);
    this._items.next([]);
    this._userInfo.next(null);
    this.authService.userProfile().subscribe((res: any) => {
      this._loadingsubject.next(false);
      if (res.success) {
        const perfil = {
          nombre: res.result.nombre,
          rol: res.result.perfil ? res.result.perfil.descripcion : '',
        };
        this._userInfo.next(perfil);
        if (res.result.perfil != null) {
          this.generarMenu(res.result.perfil);
        }
      }
    });
  }

  generarMenu(menu: any) {
    menu.permisos.forEach((permiso: any) => {
      if (permiso.codigo == 'subheading') {
        console.log(permiso);

        const opciones: NavigationSubheading = {
          type: 'subheading',
          label: permiso.descripcion,
          children: permiso.opciones.map((opcion: any) => {
            return {
              type: opcion.operaciones,
              label: opcion.descripcion,
              route: opcion.accion,
              icon: opcion.icono != ' ' && opcion.icono != null ? opcion.icono : 'mat:insights',
              routerLinkActiveOptions: { exact: true }
            }
          })
        };
        this._items.next([...this._items.value, opciones]);
      }

    }, (error: any) => {
      this._loadingsubject.next(false);
    });
  }
}
