//Modules
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { CardModule } from 'primeng/card';
import { PanelModule } from 'primeng/panel';
import { TooltipModule } from 'primeng/tooltip';
import { TableModule } from 'primeng/table';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { FileUploadModule } from 'primeng/fileupload';
import { RippleModule } from 'primeng/ripple';
import { NgxSpinnerModule } from "ngx-spinner";
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { InputNumberModule } from 'primeng/inputnumber';
import { GalleriaModule } from 'primeng/galleria';
import { CalendarModule } from 'primeng/calendar';
import { ChartModule } from 'angular-highcharts';

//Components
import { AppComponent } from './app.component';
import { FacturacionComponent } from './components/facturacion/facturacion.component';
import { ProductosComponent } from './components/productos/productos.component';
import { FooterComponent } from './components/footer/footer.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { TableroComponent } from './components/tablero/tablero.component';
import { SvgComponent } from './components/svg/svg.component';
import { ImpuestosComponent } from './components/impuestos/impuestos.component';
import { GastosComponent } from './components/gastos/gastos.component';
import { GraficasComponent } from './components/graficas/graficas.component';


@NgModule({
  declarations: [
    AppComponent,
    FacturacionComponent,
    ProductosComponent,
    FooterComponent,
    PageNotFoundComponent,
    TableroComponent,
    SvgComponent,
    ImpuestosComponent,
    GastosComponent,
    GraficasComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    CardModule,
    PanelModule,
    TooltipModule,
    TableModule,
    DropdownModule,
    InputTextModule,
    ButtonModule,
    DialogModule,
    FileUploadModule,
    RippleModule,
    NgxSpinnerModule,
    NgbModule,
    InputTextareaModule,
    InputNumberModule,
    GalleriaModule,
    CalendarModule,
    ChartModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
