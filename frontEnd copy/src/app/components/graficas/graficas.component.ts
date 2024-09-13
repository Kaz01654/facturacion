import { Component, OnInit } from '@angular/core';
import { GraficasService } from './../../services/graficas.service';
import { Chart } from 'angular-highcharts';
import { SelectItem } from 'primeng/api';
import { NgxSpinnerService } from "ngx-spinner";
import * as Highcharts from "highcharts";
import swal from 'sweetalert2';

const HighchartsExporting = require('highcharts/modules/exporting');
const HighchartsExportData = require('highcharts/modules/export-data');
HighchartsExporting(Highcharts);
HighchartsExportData(Highcharts);

@Component({
  selector: 'app-graficas',
  templateUrl: './graficas.component.html',
  styleUrls: ['./graficas.component.css']
})
export class GraficasComponent implements OnInit {
  data_series: any = [];
  categorias: any = [];
  tipos: any = [];
  column_colors: any = [];
  listYear: SelectItem[];
  year = null;
  chart: Chart;

  constructor(
    private api: GraficasService,
    private spinner: NgxSpinnerService
  ) {
    this.categorias = ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'];
    this.tipos = ['Ingresos','Gastos'];
    this.column_colors = ['#66BB6A', '#FF5252']
   }

   async ngOnInit(): Promise<void> {
    this.spinner.show();
    await Promise.all([
      this.getYears(),
      this.poblarGrafica(new Date().getFullYear())
    ]);
    this.spinner.hide();
  }

  async fillSeries() {
    this.data_series = [];
    for (let i = 0; i <= 1; i++) {
      await this.data_series.push({
        name: this.tipos[i],
        type: 'column',
        data: [0,0,0,0,0,0,0,0,0,0,0,0],
        color: this.column_colors[i],
        animation: {
          duration: 1500,
          easing: (pos) => {
            if ((pos) < (1 / 2.75)) {
              return (7.5625 * pos * pos);
            }
            if (pos < (2 / 2.75)) {
              return (7.5625 * (pos -= (1.5 / 2.75)) * pos + 0.75);
            }
            if (pos < (2.5 / 2.75)) {
              return (7.5625 * (pos -= (2.25 / 2.75)) * pos + 0.9375);
            }
            return (7.5625 * (pos -= (2.625 / 2.75)) * pos + 0.984375);
          }
        }
      })
    }
  }

  async getYears() {
    this.listYear = [];
    await this.api.getYears().then((data: any) => {
      for (let i = 0; i < data.length; i++) {
        this.listYear.push({label: data[i].year.toString(), value: data[i].year});
      }
      this.year = this.listYear[0].value;
    }, (error) => {
      swal.fire('Error!', `${ error.statusText }`, 'error')
    })
  }

  async poblarGrafica(year) {
    await this.api.getGastosByYear(year).then(async (data: any) => {
      await this.fillSeries();
      data.forEach((op) => {
        this.data_series[0]['data'][op.mes - 1] = (op.ingresos) ? op.ingresos : 0;
        this.data_series[1]['data'][op.mes - 1] = (op.gastos) ? op.gastos : 0;
      });

      let ingresos_ano = parseFloat(this.data_series[0]['data'].reduce((accumulator, ingreso) => {
        return accumulator + ingreso;
      }, 0));

      let gastos_ano = parseFloat(this.data_series[1]['data'].reduce((accumulator, gasto) => {
        return accumulator + gasto;
      }, 0));

      let result_ano = Math.abs(ingresos_ano - gastos_ano);

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
        //   pointFormat: '<tr><td style = "color:{series.color};padding:0">{series.name}: </td>' +
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
      });
    }, (error) => {
      swal.fire('Error!', `${ error.statusText }`, 'error')
    })
  }
}
