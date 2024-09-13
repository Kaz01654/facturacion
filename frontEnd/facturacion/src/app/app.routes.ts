import { Routes } from '@angular/router'

export const routes: Routes = [
    {
      path: '', loadComponent: () => import('./layout/app.layout.component').then(m => m.AppLayoutComponent),
      children: [
          { path: '', loadComponent: () => import('./components/tablero/tablero.component').then(m => m.TableroComponent)},
          { path: 'facturacion', loadComponent: () => import('./components/facturacion/facturacion.component').then(m => m.FacturacionComponent)},
          { path: 'productos', loadComponent: () => import('./components/productos/productos.component').then(m => m.ProductosComponent)},
          { path: 'impuestos', loadComponent: () => import('./components/impuestos/impuestos.component').then(m => m.ImpuestosComponent)},
          { path: 'gastos', loadComponent: () => import('./components/gastos/gastos.component').then(m => m.GastosComponent)},
          { path: 'clientes', loadComponent: () => import('./components/clientes/clientes.component').then(m => m.ClientesComponent)},
          { path: 'graficas', loadComponent: () => import('./components/graficas/graficas.component').then(m => m.GraficasComponent)}
      ]
  },
  { path: 'notfound', loadComponent: () => import('./components/page-not-found/page-not-found.component').then(m => m.PageNotFoundComponent)},
  { path: '**', redirectTo: '/notfound' },
]
