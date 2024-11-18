import { LayoutComponent } from './layouts/layout/layout.component';
import { VexRoutes } from '@vex/interfaces/vex-route.interface';
import { LoginComponent } from './pages/pages/auth/login/login.component';
import { Codigo_verificacionComponent } from './pages/pages/auth/codigo_verificacion/codigo_verificacion.component';
import { IncidentesComponent } from './pages/pages/incidentes/incidentes.component';
import { UsuariosComponent } from './pages/pages/usuarios/usuarios.component';
import { Error404Component } from './pages/pages/errors/error-404/error-404.component';
import { AuthRedirectGuard } from './core/guards/auth-redirect.guard';
import { AuthGuard } from './core/guards/auth.guard';
import { RolesComponent } from './pages/pages/usuarios/roles/roles.component';

export const appRoutes: VexRoutes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [AuthRedirectGuard]
  },
  {
    path: 'codigo_verificacion',
    component: Codigo_verificacionComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'home',
    component: LayoutComponent,
    canActivate: [AuthGuard],
    children: [

      {
        path: '',
        component: IncidentesComponent,
        canActivate: [AuthGuard]
      },

      {
        path: 'usuarios',
        component: UsuariosComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'rol',
        component: RolesComponent,
        canActivate: [AuthGuard]
      }
    ]
  },
  {
    path: '**',
    component: Error404Component
  }
];
