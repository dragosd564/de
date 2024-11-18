import { Injectable } from '@angular/core';
import { VexLayoutService } from '@vex/services/vex-layout.service';
import { NavigationItem } from './navigation-item.interface';
import { BehaviorSubject, Observable } from 'rxjs';
import { AuthService } from '../service/auth.service';

@Injectable({
  providedIn: 'root'
})
export class NavigationLoaderService {
  private readonly _items: BehaviorSubject<NavigationItem[]> =
    new BehaviorSubject<NavigationItem[]>([]);

  get items$(): Observable<NavigationItem[]> {
    return this._items.asObservable();
  }

  constructor(private readonly layoutService: VexLayoutService, private authService: AuthService) {
    this.loadNavigation();
  }

  loadNavigation(): void {
    // this.authService.userProfile().subscribe((res: any) => {
    //   if (res.success) {
    //     res.permisos.forEach((permiso: any) => {
    //       if (permiso.tipo === 'subheading') {
    //         this._items.next([
    //           ...this._items.getValue(),
    //           {
    //             type: permiso.tipo,
    //             label: permiso.label,
    //             children: []
    //           }
    //         ]);
    //       } else {
    //         this._items.next([
    //           ...this._items.getValue(),
    //           {
    //             type: permiso.tipo,
    //             label: permiso.label,
    //             route: permiso.route,
    //             icon: permiso.icon,
    //             routerLinkActiveOptions: { exact: true }
    //           }
    //         ]);
    //       }
    //     });
    //   }
    // });
    this._items.next([
      {
        type: 'subheading',
        label: 'Gestión de Incidentes',
        children: [
          {
            type: 'link',
            label: 'Incidentes',
            route: '',
            icon: 'mat:insights',
            routerLinkActiveOptions: { exact: true }
          },
        ]
      },

      {
        type: 'subheading',
        label: 'Gestión de Usuarios',
        children: [
          {
            type: 'link',
            label: 'Usuarios',
            route: 'usuarios',
            icon: 'mat:people',
            routerLinkActiveOptions: { exact: true }
          },
          {
            type: 'link',
            label: 'Roles',
            route: 'rol',
            icon: 'mat:people',
            routerLinkActiveOptions: { exact: true }
          }
        ]
      }

    ]);
  }
}
