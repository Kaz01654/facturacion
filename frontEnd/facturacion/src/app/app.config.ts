import { ApplicationConfig, provideZoneChangeDetection, importProvidersFrom } from '@angular/core'
import { PreloadAllModules, provideRouter, withHashLocation, withPreloading, withViewTransitions } from '@angular/router'
import { routes } from './app.routes'
import { FacturacionService } from './services/facturacion.service'
import { GastosService } from './services/gastos.service'
import { ProductosService } from './services/productos.service'
import { ImpuestoService } from './services/impuesto.service'
import { GraficasService } from './services/graficas.service'
import { BrowserAnimationsModule, provideAnimations } from '@angular/platform-browser/animations'
import { BrowserModule } from '@angular/platform-browser'
import { provideHttpClient, withFetch } from '@angular/common/http'
import { NgbModule } from '@ng-bootstrap/ng-bootstrap'
import { FormsModule } from '@angular/forms'
import { CardModule } from 'primeng/card'
import { PanelModule } from 'primeng/panel'
import { TooltipModule } from 'primeng/tooltip'
import { TableModule } from 'primeng/table'
import { DropdownModule } from 'primeng/dropdown'
import { InputTextModule } from 'primeng/inputtext'
import { ButtonModule } from 'primeng/button'
import { DialogModule } from 'primeng/dialog'
import { FileUploadModule } from 'primeng/fileupload'
import { RippleModule } from 'primeng/ripple'
import { InputTextareaModule } from 'primeng/inputtextarea'
import { InputNumberModule } from 'primeng/inputnumber'
import { GalleriaModule } from 'primeng/galleria'
import { CalendarModule } from 'primeng/calendar'
import { ChartModule } from 'angular-highcharts'
import { NgxSpinnerModule } from 'ngx-spinner'
import { ClientesService } from './services/clientes.service'

interface NgxSpinnerConfig {
  type?: string
}

export const appConfig: ApplicationConfig = {
  providers: [
    importProvidersFrom(
      BrowserModule,
      BrowserAnimationsModule,
      PanelModule,
      RippleModule,
      InputTextareaModule,
      InputNumberModule,
      GalleriaModule,
      ChartModule,
      FormsModule,
      TableModule,
      ButtonModule,
      DropdownModule,
      CardModule,
      DialogModule,
      TooltipModule,
      NgxSpinnerModule.forRoot({ type: 'ball-scale-multiple' }),
      InputTextModule,
      CalendarModule,
      FileUploadModule,
      NgbModule
    ),
    GastosService,
    ProductosService,
    ImpuestoService,
    GraficasService,
    FacturacionService,
    ClientesService,
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes, withHashLocation(), withViewTransitions(), withPreloading(PreloadAllModules)),
    provideHttpClient(withFetch()),
    provideAnimations()
  ]
}
