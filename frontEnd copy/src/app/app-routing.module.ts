import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FacturacionComponent } from './components/facturacion/facturacion.component';
import { ProductosComponent } from './components/productos/productos.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { TableroComponent } from './components/tablero/tablero.component';
import { ImpuestosComponent } from './components/impuestos/impuestos.component';
import { GastosComponent } from './components/gastos/gastos.component';
import { GraficasComponent } from './components/graficas/graficas.component';

const routes: Routes = [
  { path: '', component: TableroComponent},
  { path: 'facturacion', component: FacturacionComponent},
  { path: 'productos', component: ProductosComponent},
  { path: 'impuestos', component: ImpuestosComponent},
  { path: 'gastos', component: GastosComponent},
  { path: 'graficas', component: GraficasComponent},
  //Wild Card Route for 404 request
  { path: '**', pathMatch: 'full', component: PageNotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
