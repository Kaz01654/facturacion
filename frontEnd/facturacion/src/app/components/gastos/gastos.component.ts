import { Component } from '@angular/core'
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner'
import { PrimeNGConfig, SelectItem } from 'primeng/api'
import { GastosService } from '../../services/gastos.service'
import { ProductosService } from '../../services/productos.service'
import { CardModule } from 'primeng/card'
import { CommonModule } from '@angular/common'
import { DialogModule } from 'primeng/dialog'
import { TableModule } from 'primeng/table'
import { TooltipModule } from 'primeng/tooltip'
import { InputTextModule } from 'primeng/inputtext'
import { CalendarModule } from 'primeng/calendar'
import { ButtonModule } from 'primeng/button'
import { HttpErrorResponse } from '@angular/common/http'
import { FormsModule } from '@angular/forms'
import { InputNumberModule } from 'primeng/inputnumber'
import { DropdownModule } from 'primeng/dropdown'
import swal from 'sweetalert2'
import * as XLSX from 'xlsx'

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
  selector: 'app-gastos',
  standalone: true,
  imports: [
    NgxSpinnerModule,
    CardModule,
    CommonModule,
    DialogModule,
    TableModule,
    TooltipModule,
    InputTextModule,
    CalendarModule,
    ButtonModule,
    FormsModule,
    InputNumberModule,
    DropdownModule
  ],
  templateUrl: './gastos.component.html',
  styleUrl: './gastos.component.scss'
})

export class GastosComponent {
  fileName: string = 'Informe.xlsx'
  filas: number = 0
  columnas: any[] = []
  info: any[] = []
  infoProd: any[] = []
  listProd: SelectItem[] = []
  prod = null
  loading: boolean = false
  titleModal: string = 'Agregar Gasto'
  textBottom: string = 'Agregar'
  lbBtnModal: string = 'Cancelar'
  btnClean: string = 'Limpiar'
  fecha_datos : Date | undefined
  op: string = 'Add'
  total_prod: number = 0
  total_var: number = 0
  total_copy: number = 0
  total_plot: number = 0
  total_comp: number = 0
  total_gast: number = 0
  total_ing: number = 0
  total_gastos: number = 0
  total_resultado: number = 0
  tipo_global: number = 0
  cat_global: number = 0
  visible: boolean = false
  total_input: boolean = true

  //Campos Gasto
  id: number = 0
  desc: string = ''
  cant: number = 1
  valor: number | undefined
  total: number | undefined
  tipo: number | undefined
  cat: number | undefined
  fecha_op : Date = new Date()

  constructor(
    private api: GastosService,
    private apiProd: ProductosService,
    private spinner: NgxSpinnerService,
    private primengConfig: PrimeNGConfig
  ) {
    // ✅ Traducción calendario
    this.primengConfig.setTranslation({
      dayNames: [ 'Domingo','Lunes','Martes','Miércoles','Jueves','Viernes','Sábado'],
      dayNamesShort: [ 'Dom','Lun','Mar','Mié','Jue','Vie','Sáb'],
      dayNamesMin: [ 'Do','Lu','Ma','Mi','Ju','Vi','Sa'],
      monthNames: [ 'Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'],
      monthNamesShort: [ 'Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'],
      today: 'Hoy',
      clear: 'Todos los registros'
    })

    // ✅ Iniciamos las variables para la tabla
    this.filas = 10
    this.columnas = [
      { field: 'descripcion', header: 'Descripcion'},
      { field: 'cantidad', header: 'Cantidad'},
      { field: 'valor', header: 'Valor'},
      { field: 'total', header: 'Total'},
      { field: 'fecha_op', header: 'Fecha OP' },
      { field: 'fecha_registro', header: 'Fecha Registro' },
      { field: '', header: 'Acciones' }
    ]
  }

  async ngOnInit(): Promise<void> {
    this.primengConfig.ripple = true
    this.load(true)
    await this.getProd()
    await this.poblarTabla()
    this.load(false)
  }

  calculos(data: any) {
    this.total_prod = this.total_var = this.total_copy = this.total_plot = this.total_comp = this.total_gast = this.total_gastos = this.total_ing = this.total_resultado = 0
    data.forEach((op: any) => {
      switch (op.categoria) {
        case 1:
          this.total_prod += op.total
        break
        case 2:
          this.total_var += op.total
        break
        case 3:
          this.total_copy += op.total
        break
        case 4:
          this.total_plot += op.total
        break
        case 5:
          this.total_comp += op.total
        break
        default:
          this.total_gast += op.total
        break
      }
    })
    this.total_ing = this.total_prod + this.total_copy + this.total_plot + this.total_var
    this.total_gastos = this.total_gast + this.total_comp
    this.total_resultado = Math.abs(this.total_ing - this.total_gastos)
  }

  async prodControl(id: any, cant: number) {
    this.load(true)
    this.apiProd.prodControl(id, cant).subscribe((data: any) => {
      swalAnimate.fire({
        position: 'bottom-end',
        icon: 'success',
        title: data['mgs'],
        showConfirmButton: false,
        timer: 2000,
        toast: true
      })
      this.getProd()
    }, (err: HttpErrorResponse) => {
      swalAnimate.fire('Error!', `${ err.message }`, 'error')
    }, () => this.load(false))
  }

  async poblarTabla(fecha: any = undefined) {
    this.fecha_datos = fecha
    this.load(true)
    if (fecha == undefined || fecha == '') {
      this.api.getGastos().subscribe(async (data: any) => {
        this.info = await data
        this.calculos(this.info)
      }, (err: HttpErrorResponse) => {
        swalAnimate.fire('Error!', `${ err.message }`, 'error')
      }, () => this.load(false))
    } else {
      this.api.getGastosByDate(this.formatearFecha(fecha).fecha).subscribe(async (data: any) => {
        this.info = await data
        this.calculos(this.info)
      }, (err: HttpErrorResponse) => {
        swalAnimate.fire('Error!', `${ err.message }`, 'error')
      }, () => this.load(false))
    }
  }

  async getProd() {
    this.load(true)
    this.listProd = [{label: 'Seleccione Producto', value: null}]
    this.apiProd.getProducts().subscribe(async (data: any) => {
      this.infoProd = await data
      for (let i = 0; i < data.length; i++) {
        this.listProd.push({label: data[i].nombre_prod + ' - ' + data[i].cant_prod, value: data[i].id_prod})
      }
      this.prod = this.listProd[0].value
    }, (err: HttpErrorResponse) => {
      swalAnimate.fire('Error!', `${ err.message }`, 'error')
    }, () => this.load(false))
  }

  operationCant(e: any) {
    if (e) {
      this.total = this.valor! * e.value
    }
  }

  operationVal(e: any) {
    if (e) {
      this.total = this.cant * e.value
    }
  }

  open(op: string) {
    this.clean()
    this.titleModal = 'Agregar ' + op
    this.textBottom = 'Agregar'
    this.op = 'Add'
    this.tipo_global = (op == 'Variado') ? 1 : 2
    this.cat_global = (op == 'Variado') ? 2 : (op == 'Compra') ? 5 : 6
    this.showDialog()
  }

  openUpdate(data: any) {
    this.titleModal = 'Editar Variado'
    this.textBottom = 'Editar'
    this.op = 'Edit'
    this.id = data.id
    this.desc = data.descripcion
    this.valor = data.valor
    this.total = data.total
    this.tipo = data.tipo
    this.cat = data.categoria
    this.cant = data.cantidad
    this.fecha_op = new Date(data.fecha_op)
    this.showDialog()
  }

  async openCopy() {
    const resp = await swalAnimate.fire({
      title: 'Agregue cantidad de copias',
      input: 'number',
      inputPlaceholder: 'Cantidad',
      inputAttributes: {
        'aria-label': 'Cantidad',
        min: '1',
        max: '9999'
      },
      inputValue: 1,
      confirmButtonText: 'Guardar',
      showCancelButton: true,
      allowOutsideClick: false
    })

    if (resp.isConfirmed) {
      if (resp.value <= 0) {
        swalAnimate.fire('Cuidado!', 'La cantidad de copias no puede ser menor o igual a cero!', 'warning')
      } else {
        let object = {
          descripcion: 'Copias',
          cantidad: resp.value,
          valor: 1,
          total: resp.value * 1,
          tipo: 1,
          categoria: 3,
          fecha_op: this.formatearFecha(this.fecha_op).completo
        }

        this.load(true)
        this.api.insertGasto(object).subscribe((data: any) => {
          if (data['status']) {
            swalAnimate.fire({
              position: 'top-end',
              icon: 'success',
              title: data['mgs'],
              showConfirmButton: false,
              timer: 2000
            }).then(async () => {
              await this.poblarTabla(this.fecha_datos)
            })
          } else {
            swalAnimate.fire('Cuidado!', data['mgs'], 'warning')
          }
        }, (err: HttpErrorResponse) => {
          swalAnimate.fire('Error!', `${ err.message }`, 'error')
        }, () => (this.load(false), this.closeDialog()))
      }
    }
  }

  async openPlotter() {
    const resp = await swalAnimate.fire({
      title: 'Agregue cantidad de plotter',
      input: 'number',
      inputPlaceholder: 'Cantidad',
      inputAttributes: {
        'aria-label': 'Cantidad',
        min: '1',
        max: '9999'
      },
      inputValue: 1,
      confirmButtonText: 'Guardar',
      showCancelButton: true,
      allowOutsideClick: false
    })

    if (resp.isConfirmed) {
      if (resp.value <= 0) {
        swalAnimate.fire('Cuidado!', 'La cantidad de plotter no puede ser menor o igual a cero!', 'warning')
      } else {
        let object = {
          descripcion: 'Plotter',
          cantidad: resp.value,
          valor: 70,
          total: resp.value * 70,
          tipo: 1,
          categoria: 4,
          fecha_op: this.formatearFecha(this.fecha_op).completo
        }

        this.load(true)
        this.api.insertGasto(object).subscribe((data: any) => {
          if (data['status']) {
            swalAnimate.fire({
              position: 'top-end',
              icon: 'success',
              title: data['mgs'],
              showConfirmButton: false,
              timer: 2000
            }).then(async () => {
              await this.poblarTabla(this.fecha_datos)
            })
          } else {
            swalAnimate.fire('Cuidado!', data['mgs'], 'warning')
          }
        }, (err: HttpErrorResponse) => {
          swalAnimate.fire('Error!', `${ err.message }`, 'error')
        }, () => (this.load(false), this.closeDialog()))
      }
    }
  }

  async openCoPoUpdate(info: any) {
    const resp = await swalAnimate.fire({
      title: 'Edite la cantidad de ' + info.descripcion,
      input: 'number',
      inputPlaceholder: 'Cantidad',
      inputAttributes: {
        'aria-label': 'Cantidad',
        min: '1',
        max: '9999'
      },
      inputValue: info.cantidad,
      confirmButtonText: 'Guardar',
      showCancelButton: true,
      allowOutsideClick: false
    })

    if (resp.isConfirmed) {
      if (resp.value <= 0) {
        swalAnimate.fire('Cuidado!', 'La cantidad de ' + info.descripcion + ' no puede ser menor o igual a cero!', 'warning')
      } else {
        let object = {
          descripcion: info.descripcion,
          cantidad: resp.value,
          valor: ((info.categoria == 3)? 1 : 70),
          total: resp.value * ((info.categoria == 3)? 1 : 70),
          tipo: info.tipo,
          categoria: info.categoria,
          fecha_op: this.formatearFecha(new Date(info.fecha_op)).completo
        }

        this.load(true)
        this.api.updateGasto(info.id, object).subscribe((data: any) => {
          if (data['status']) {
            swalAnimate.fire({
              position: 'top-end',
              icon: 'success',
              title: data['mgs'],
              showConfirmButton: false,
              timer: 2000
            }).then(async () => {
              await this.poblarTabla(this.fecha_datos)
            })
          } else {
            swalAnimate.fire('Cuidado!', data['mgs'], 'warning')
          }
        }, (err: HttpErrorResponse) => {
          swalAnimate.fire('Error!', `${ err.message }`, 'error')
        }, () => (this.load(false), this.closeDialog()))
      }
    }
  }

  async openProdUpdate(info: any) {
    let obj = this.infoProd[this.infoProd.findIndex(x => x.nombre_prod == info.descripcion)]
    const resp = await swalAnimate.fire({
      title: 'Edite la cantidad de ' + obj.nombre_prod,
      input: 'number',
      inputPlaceholder: 'Cantidad',
      inputAttributes: {
        'aria-label': 'Cantidad',
        min: '1',
        max: obj.cant_prod + info.cantidad
      },
      inputValue: info.cantidad,
      validationMessage: 'La cantidad ingresada sobrepasa lo que hay en existencia!',
      confirmButtonText: 'Guardar',
      showCancelButton: true,
      allowOutsideClick: false
    })

    if (resp.isConfirmed) {
      if (resp.value <= 0) {
        swalAnimate.fire('Cuidado!', 'La cantidad de ' + obj.nombre_prod + ' no puede ser menor o igual a cero!', 'warning')
      } else {
        let object = {
          descripcion: obj.nombre_prod,
          cantidad: resp.value,
          valor: (((parseFloat(obj.precio_prod) * obj.impuesto) + parseFloat(obj.ganancia_prod) + parseFloat(obj.precio_prod))),
          total: (((parseFloat(obj.precio_prod) * obj.impuesto) + parseFloat(obj.ganancia_prod) + parseFloat(obj.precio_prod)) * Number(resp.value)),
          tipo: info.tipo,
          categoria: info.categoria,
          fecha_op: this.formatearFecha(new Date(info.fecha_op)).completo
        }

        this.load(true)
        this.api.updateGasto(info.id, object).subscribe((data: any) => {
          if (data['status']) {
            swalAnimate.fire({
              position: 'top-end',
              icon: 'success',
              title: data['mgs'],
              showConfirmButton: false,
              timer: 2000
            }).then(async () => {
              await this.poblarTabla(this.fecha_datos)
              await this.prodControl(obj.id_prod, (obj.cant_prod + info.cantidad) - resp.value)
              this.clean()
            })
          } else {
            swalAnimate.fire('Cuidado!', data['mgs'], 'warning')
          }
        }, (err: HttpErrorResponse) => {
          swalAnimate.fire('Error!', `${ err.message }`, 'error')
        }, () => (this.load(false), this.closeDialog()))
      }
    }
  }

  async agregarGasto() {
    if (this.desc == '' || this.fecha_op == null || this.valor == null || this.cant == 0) {
      swalAnimate.fire({
        position: 'bottom-end',
        icon: 'warning',
        title: 'Debe llenar todos los campos!',
        showConfirmButton: false,
        timer: 2000,
        toast: true
      })
    } else {
      let object = {
        descripcion: this.desc,
        cantidad: this.cant,
        valor: this.valor,
        total: this.total,
        tipo: this.tipo_global,
        categoria: this.cat_global,
        fecha_op: this.formatearFecha(this.fecha_op).completo
      }

      this.load(true)
      this.api.insertGasto(object).subscribe((data: any) => {
        if (data['status']) {
          swalAnimate.fire({
            position: 'top-end',
            icon: 'success',
            title: data['mgs'],
            showConfirmButton: false,
            timer: 2000
          }).then(async () => {
            await this.poblarTabla(this.fecha_datos)
            this.clean()
          })
        } else {
          swalAnimate.fire('Cuidado!', data['mgs'], 'warning')
        }
      }, (err: HttpErrorResponse) => {
        swalAnimate.fire('Error!', `${ err.message }`, 'error')
      }, () => (this.load(false), this.closeDialog()))
    }
  }

  async editarGasto() {
    if (this.desc == '' || this.fecha_op == null || this.valor == null || this.cant == 0) {
      swalAnimate.fire({
        position: 'bottom-end',
        icon: 'warning',
        title: 'Debe llenar todos los campos!',
        showConfirmButton: false,
        timer: 2000,
        toast: true
      })
    } else {
      let object = {
        descripcion: this.desc,
        cantidad: this.cant,
        valor: this.valor,
        total: this.total,
        tipo: this.tipo,
        categoria: this.cat,
        fecha_op: this.formatearFecha(this.fecha_op).completo
      }

      this.load(true)
      this.api.updateGasto(this.id, object).subscribe((data: any) => {
        if (data['status']) {
          swalAnimate.fire({
            position: 'top-end',
            icon: 'success',
            title: data['mgs'],
            showConfirmButton: false,
            timer: 2000
          }).then(async () => {
            await this.poblarTabla(this.fecha_datos)
            this.clean()
          })
        } else {
          swalAnimate.fire('Cuidado!', data['mgs'], 'warning')
        }
      }, (err: HttpErrorResponse) => {
        swalAnimate.fire('Error!', `${ err.message }`, 'error')
      }, () => (this.load(false), this.closeDialog()))
    }
  }

  async deleteGasto(id: any) {
    swalAnimate.fire({
      title: 'Esta seguro de realizar esta accion?',
      text: 'Se va a eliminar la operacion!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Eliminar',
      confirmButtonColor: '#d33',
      cancelButtonText: 'Cancelar',
      cancelButtonColor: '#B9B6B5',
    }).then(async (result) => {
      if (result.value) {
        this.load(true)
        this.api.deleteGasto(id).subscribe((data: any) => {
          if (data['status']) {
            swalAnimate.fire({
              position: 'top-end',
              icon: 'success',
              title: data['mgs'],
              showConfirmButton: false,
              timer: 2000
            }).then(async () => {
              if (data['data'].categoria == 1) {
                let obj = this.infoProd[this.infoProd.findIndex(x => x.nombre_prod == data['data'].descripcion)]
                await this.prodControl(obj.id_prod, obj.cant_prod + data['data'].cantidad)
              }
            })
          } else {
            swalAnimate.fire('Cuidado!', data['mgs'], 'warning')
          }
        }, (err: HttpErrorResponse) => {
          swalAnimate.fire('Error!', `${ err.message }`, 'error')
        }, () => (this.poblarTabla(this.fecha_datos), this.load(false), this.closeDialog()))
      }
    })
  }

  async agregarProd(e: any) {
    if (e) {
      let obj = await this.infoProd[this.infoProd.findIndex(x => x.id_prod == e)]
      if (obj.cant_prod) {
        swalAnimate.fire({
          title: 'Agregue la cantidad de ' + obj.nombre_prod,
          input: 'number',
          inputPlaceholder: 'Cantidad',
          inputAttributes: {
            'aria-label': 'Cantidad',
            min: '1',
            max: obj.cant_prod
          },
          inputValue: 1,
          validationMessage: 'La cantidad ingresada sobrepasa lo que hay en existencia!',
          confirmButtonText: 'Guardar',
          showCancelButton: true,
          allowOutsideClick: false
        }).then((result) => {
          if (result.isConfirmed) {
            let object = {
              descripcion: obj.nombre_prod,
              cantidad: result.value,
              valor: (((parseFloat(obj.precio_prod) * obj.impuesto) + parseFloat(obj.ganancia_prod) + parseFloat(obj.precio_prod))),
              total: (((parseFloat(obj.precio_prod) * obj.impuesto) + parseFloat(obj.ganancia_prod) + parseFloat(obj.precio_prod)) * Number(result.value)),
              tipo: 1,
              categoria: 1,
              fecha_op: this.formatearFecha(this.fecha_op).fecha
            }

            this.load(true)
            this.api.insertGasto(object).subscribe((data: any) => {
              if (data['status']) {
                swalAnimate.fire({
                  position: 'top-end',
                  icon: 'success',
                  title: data['mgs'],
                  showConfirmButton: false,
                  timer: 2000
                }).then(async () => {
                  await this.poblarTabla(this.fecha_datos)
                  await this.prodControl(obj.id_prod, obj.cant_prod - data['data'].cantidad)
                  this.clean()
                })
              } else {
                swalAnimate.fire('Cuidado!', data['mgs'], 'warning')
              }
            }, (err: HttpErrorResponse) => {
              swalAnimate.fire('Error!', `${ err.message }`, 'error')
            }, () => (this.load(false), this.closeDialog()))
          } else if (result.isDenied) {
            swalAnimate.fire('Cambios no guardados!', '', 'info')
          }
        })
      } else {
        swalAnimate.fire(`Cuidado!`, `El producto ${ obj.nombre_prod } no tiene unidades en existencia!`, 'warning')
      }
    }
  }

  ConvertToCSV(objArray: any, headerList: any, key: any) {
    let array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray
    let str = ''
    let row = ''
    for (let index in headerList) {
      row += headerList[index] + ', '
    }
    row = row.replace(/,\s*$/, "")
    str += row + '\r\n'
    for (let i = 0; i < array.length; i++) {
      let line = ''
      let j = 0
      for (let index in key) {
        let head = key[index]
        line += ((j != 0) ? ', ' : '') + array[i][head]
        j++
      }
      str += line + '\r\n'
    }
    return str
  }

  descargarCSV(data: any, filename: string = 'data') {
    let csvData = this.ConvertToCSV(data, [ 'Descripcion', 'Cantidad', 'Valor', 'Total', 'Fecha Operacion', 'Fecha Registro'],
    ['descripcion', 'cantidad', 'valor', 'total', 'fecha_op', 'fecha_registro'])
    let blob = new Blob(['\ufeff' + csvData], {
      type: 'text/csvcharset=utf-8'
    })
    let dwldLink = document.createElement("a")
    let url = URL.createObjectURL(blob)
    let isSafariBrowser = navigator.userAgent.indexOf('Safari') != -1 && navigator.userAgent.indexOf('Chrome') == -1

    //if Safari open in new window to save file with random filename.
    if (isSafariBrowser) {
      dwldLink.setAttribute("target", "_blank")
    }
    dwldLink.setAttribute("href", url)
    dwldLink.setAttribute("download", filename + ".csv")
    dwldLink.style.visibility = "hidden"
    document.body.appendChild(dwldLink)
    dwldLink.click()
    document.body.removeChild(dwldLink)
  }

  descargarExcel() {
    let inform: any[] = new Array()
    this.info.forEach(element => {
      let params = {
        descripcion: element.descripcion,
        cantidad: element.cantidad,
        valor: element.valor,
        total: element.total,
        tipo: element.tipo_desc,
        fecha_op: this.formatearFecha(new Date(element.fecha_op)).fecha,
        fecha_registro: this.formatearFecha(new Date(element.fecha_registro)).fecha
      }
      inform.push(params)
    })
    // Obtenemos el json
    const ws = XLSX.utils.json_to_sheet(inform)
    // Asignamos nombre a las columnas
    ws['A1'].v = "Descripcion"
    ws['B1'].v = "Cantidad"
    ws['C1'].v = "Valor"
    ws['D1'].v = "Total"
    ws['E1'].v = "Tipo"
    ws['F1'].v = "Fecha Operacion"
    ws['G1'].v = "Fecha Registro"

    // Generamos el libro y agregamos loas hojas
    const wb: XLSX.WorkBook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'Informe Operaciones')

    // Guardamos en el archivo
    XLSX.writeFile(wb, this.fileName)
  }

  // Formato deseado de la fecha
  formatearFecha(date: Date) {
    let h = this.addZero(date.getHours())
    let m = this.addZero(date.getMinutes())
    let s = this.addZero(date.getSeconds())
    let anio = date.getFullYear()
    let mes = this.addZero(date.getMonth() + 1)
    let dia = this.addZero(date.getDate())
    let formato = {
      completo: anio + "-" + mes + "-" + dia + " " + h + ":" + m + ":" + s,
      fecha: anio + "-" + mes + "-" + dia,
      hora: h + ":" + m + ":" + s
    }
    return formato
  }

  addZero(i: any) {
    if (i < 10) {
      i = "0" + i
    }
    return i
  }

  clean() {
    this.desc = ''
    this.valor = undefined
    this.total = undefined
    this.cant = 1
    this.prod = this.listProd[0].value
    this.fecha_op = new Date()
  }

  // ✅ Mostrar modal
  showDialog() {
    this.visible = true
  }

  // ✅ Cerrar modal
  closeDialog() {
    this.visible = false
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
