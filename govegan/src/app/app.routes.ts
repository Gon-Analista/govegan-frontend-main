import { Routes } from '@angular/router';
import { authGuard } from './auth.guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./login/login.page').then(m => m.LoginPage)
  },
  {
    path: 'restablecer',
    loadComponent: () => import('./restablecer/restablecer.page').then(m => m.RestablecerPage)
  },
  {
    path: 'registro',
    loadComponent: () => import('./registro/registro.page').then(m => m.RegistroPage)
  },
  {
    path: 'verificar-codigo',
    loadComponent: () => import('./restablecer/verify-recovery-code/verify-recovery-code.component').then(m => m.VerifyRecoveryCodeComponent)
  },
  {
    path: 'reset-password',
    loadComponent: () => import('./restablecer/reset-password/reset-password.component').then(m => m.ResetPasswordComponent)
  },
  {
    path: 'favoritos',
    canActivate: [authGuard],
    loadComponent: () => import('./tabs/favoritos/favoritos.page').then(m => m.FavoritosPage)
  },
  {
    path: 'configuracion',
    canActivate: [authGuard],
    loadComponent: () => import('./tabs/configuracion/configuracion.page').then(m => m.ConfiguracionPage)
  },
  {
    path: 'perfil',
    canActivate: [authGuard],
    loadComponent: () => import('./tabs/perfil/perfil.page').then(m => m.PerfilPage)
  },
  {
    path: 'home',
    canActivate: [authGuard],
    loadComponent: () => import('./tabs/home/home.page').then(m => m.HomePage)
  },
  {
    path: 'planificador',
    canActivate: [authGuard],
    loadComponent: () => import('./tabs/planificador/planificador.page').then( m => m.PlanificadorPage)
  },
  {
    path: 'buscador-alimentos/:searchTerm',
    canActivate: [authGuard],
    loadComponent: () => import('./tabs/buscador-alimentos/buscador-alimentos.page').then( m => m.BuscadorAlimentosPage)

  },
  {
    path: 'buscador',
    canActivate: [authGuard],
    loadComponent: () => import('./tabs/buscador/buscador.page').then(m => m.BuscadorPage)
  },
  {
    path: 'administrar-alimentos',
    canActivate: [authGuard],
    loadComponent: () => import('./tabs/administrar-alimentos/administrar-alimentos.page').then( m => m.AdministrarAlimentosPage)
  },
  {
    path: 'gps',
    canActivate: [authGuard],
    loadComponent: () => import('./tabs/gps/gps.page').then( m => m.GpsPage)
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },



];
