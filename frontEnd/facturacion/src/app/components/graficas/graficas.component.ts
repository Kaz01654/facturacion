import { Component } from '@angular/core'
import { NgxSpinnerService } from 'ngx-spinner'
import { PrimeNGConfig, SelectItem } from 'primeng/api'
import { GraficasService } from '../../services/graficas.service'
import { HttpErrorResponse } from '@angular/common/http'
import { CommonModule } from '@angular/common'
import { DropdownModule } from 'primeng/dropdown'
import { CardModule } from 'primeng/card'
import { FormsModule } from '@angular/forms'
import { Chart, ChartModule } from 'angular-highcharts'
import { CalendarModule } from 'primeng/calendar'
import { InputTextModule } from 'primeng/inputtext'
import * as Highcharts from 'highcharts'
import swal from 'sweetalert2'

import HighchartsExporting from 'highcharts/modules/exporting'
import HighchartsExportData from 'highcharts/modules/export-data'
HighchartsExporting(Highcharts)
HighchartsExportData(Highcharts)

const swalAnimate = swal.mixin({
  showClass: {
    popup: `
      animate__animated
      animate__fadeInUp
      animate__faster
    `
  },
  hideClass: {
    popup: `
      animate__animated
      animate__fadeOutDown
      animate__faster
    `
  }
})

@Component({
  selector: 'app-graficas',
  standalone: true,
  imports: [
    ChartModule,
    CommonModule,
    DropdownModule,
    CardModule,
    FormsModule,
    CalendarModule,
    InputTextModule
  ],
  templateUrl: './graficas.component.html',
  styleUrl: './graficas.component.scss'
})

export class GraficasComponent {
  [x: string]: any
  data_series: any = []
  categorias: any = []
  tipos: any = []
  column_colors: any = []
  listYear: SelectItem[] | undefined
  year = null
  chart: Chart | undefined
  loading: boolean = false
  visible: boolean = false

  constructor(
    private api: GraficasService,
    private spinner: NgxSpinnerService,
    private primengConfig: PrimeNGConfig
  ) {
    this.categorias = ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic']
    this.tipos = ['Ingresos','Gastos']
    this.column_colors = ['#66BB6A', '#FF5252']
  }

  async ngOnInit(): Promise<void> {
    this.primengConfig.ripple = true
    this.load(true)
    await this.getYears()
    await this.poblarGrafica(new Date().getFullYear())
    this.load(false)
  }

  async fillSeries() {
    this.data_series = []
    for (let i = 0; i <= 1; i++) {
      await this.data_series.push({
        name: this.tipos[i],
        type: 'column',
        data: [0,0,0,0,0,0,0,0,0,0,0,0],
        color: this.column_colors[i],
        animation: {
          duration: 1500,
          easing: (pos: any) => {
            if ((pos) < (1 / 2.75)) {
              return (7.5625 * pos * pos)
            }
            if (pos < (2 / 2.75)) {
              return (7.5625 * (pos -= (1.5 / 2.75)) * pos + 0.75)
            }
            if (pos < (2.5 / 2.75)) {
              return (7.5625 * (pos -= (2.25 / 2.75)) * pos + 0.9375)
            }
            return (7.5625 * (pos -= (2.625 / 2.75)) * pos + 0.984375)
          }
        }
      })
    }
  }

  async getYears() {
    this.load(true)
    this.listYear = [{'value': null, 'label': 'Seleccione Año'}]
    this.api.getYears().subscribe(async (data: any) => {
      for (let i = 0; i < data.length; i++) {
        this.listYear!.push({'label': data[i].year.toString(), 'value': data[i].year})
      }
      this.year = this.listYear![0].value
    }, (err: HttpErrorResponse) => {
      swalAnimate.fire('Error!', `${ err.message }`, 'error')
    }, () => this.load(false))
  }

  async poblarGrafica(year: any) {
    if (year) {
      this.load(true)
      this.api.getGastosByYear(year).subscribe(async (data: any) => {
        await this.fillSeries()
        data.forEach((op: any) => {
          this.data_series[0]['data'][op.mes - 1] = (op.ingresos) ? op.ingresos : 0
          this.data_series[1]['data'][op.mes - 1] = (op.gastos) ? op.gastos : 0
        })

        let ingresos_ano = parseFloat(this.data_series[0]['data'].reduce((accumulator: any, ingreso: any) => {
          return accumulator + ingreso
        }, 0))

        let gastos_ano = parseFloat(this.data_series[1]['data'].reduce((accumulator: any, gasto: any) => {
          return accumulator + gasto
        }, 0))

        let result_ano = Math.abs(ingresos_ano - gastos_ano)

        this.chart = new Chart({
          chart: {
            type: 'column'
          },
          accessibility: {
            enabled: false
          },
          credits: {
            enabled: false
          },
          title: {
            text: 'Resultados del Año ' + year
            // floating: true,
            // align: 'right',
            // x: -30,
            // y: 30
          },
          subtitle:{
            text: 'Ganancia o Perdida del año: (Ingresos) L. ' + ingresos_ano + ' - ' + '(Gastos) L. ' + gastos_ano + ' = L. ' + result_ano
          },
          // tooltip : {
          //   headerFormat: '<span style = "font-size:10px">{point.key}</span><table>',
          //   pointFormat: '<tr><td style = "color:{series.color}padding:0">{series.name}: </td>' +
          //       '<td style = "padding:0"><b>L. {point.y:.2f}</b></td></tr>',
          //   footerFormat: '</table>',
          //   shared: true,
          //   useHTML: true
          // },
          xAxis:{
            categories: this.categorias,
            crosshair: true
          },
          yAxis : {
            min: 0,
            title: {
              text: 'Operaciones (Lps)'
            }
          },
          plotOptions: {
            series: {
              label: {
                connectorAllowed: false
              },
              pointStart: 0
            }
          },
          responsive: {
            rules: [{
              condition: {
                maxWidth: 500
              },
              chartOptions: {
                legend: {
                  layout: 'horizontal',
                  align: 'center',
                  verticalAlign: 'bottom'
                }
              }
            }]
          },
          exporting: {
            enabled: true
          },
          series: this.data_series
        })
      }, (err: HttpErrorResponse) => {
        swalAnimate.fire('Error!', `${ err.message }`, 'error')
      }, () => this.load(false))
    }
  }

  // ✅ Manipulación del spinner y el loading
  private load(state: boolean): void {
    if (state) {
      this.loading = true
      this.spinner.show()
    } else {
      this.loading = false
      this.spinner.hide()
    }
  }
}
