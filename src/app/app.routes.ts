import { inject } from '@angular/core';
import { Route, Routes } from '@angular/router';
import { AuthService } from './services/auth.service';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/dashboard',
    pathMatch: 'full',
  },
  {
    path: 'folder/:id',
    loadComponent: () =>
      import('./folder/folder.page').then((m) => m.FolderPage),
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./login/login.component').then((m) => m.LoginComponent),
  },
  {
    path: 'dashboard',
    canMatch: [async() => await inject(AuthService).authGuard()],
    loadComponent: () =>
      import('./dashboard/dashboard.component').then((m) => m.DashboardComponent),
  },
  {
    path: 'inventory',
    canMatch: [async() => await inject(AuthService).authGuard()],
    loadComponent: () =>
      import('./inventory/inventory.component').then((m) => m.InventoryComponent),
  },
  {
    path: 'inventory/detail/:bin/:id',
    canMatch: [async() => await inject(AuthService).authGuard()],
    loadComponent: () =>
      import('./inventory/detail/detail.component').then((m) => m.DetailComponent),
  },
  {
    path: 'lots',
    canMatch: [async() => await inject(AuthService).authGuard()],
    loadComponent: () =>
      import('./lots/lots.component').then((m) => m.LotsComponent),
  },
  {
    path: 'germination',
    canMatch: [async() => await inject(AuthService).authGuard()],
    loadComponent: () =>
      import('./germination/germination.component').then((m) => m.GerminationComponent),
  },
  {
    path: 'starts',
    canMatch: [async() => await inject(AuthService).authGuard()],
    loadComponent: () =>
      import('./starts/starts.component').then((m) => m.StartsComponent),
  },
  {
    path: 'grows',
    canMatch: [async() => await inject(AuthService).authGuard()],
    loadComponent: () =>
      import('./grows/grows.component').then((m) => m.GrowsComponent),
  },
  {
    path: 'clones',
    canMatch: [async() => await inject(AuthService).authGuard()],
    loadComponent: () =>
      import('./clones/clones.component').then((m) => m.ClonesComponent),
  },
  {
    path: 'harvests',
    canMatch: [async() => await inject(AuthService).authGuard()],
    loadComponent: () =>
      import('./harvests/harvests.component').then((m) => m.HarvestsComponent),
  },
  {
    path: 'drying',
    canMatch: [async() => await inject(AuthService).authGuard()],
    loadComponent: () =>
      import('./drying/drying.component').then((m) => m.DryingComponent),
  },
  {
    path: 'curing',
    canMatch: [async() => await inject(AuthService).authGuard()],
    loadComponent: () =>
      import('./curing/curing.component').then((m) => m.CuringComponent),
  },
];
