import { Component, inject, TemplateRef } from '@angular/core'
import { DomSanitizer } from '@angular/platform-browser'
import { PrimeNGConfig, SelectItem } from 'primeng/api'
import { ImpuestoService } from '../../services/impuesto.service'
import { ProductosService } from '../../services/productos.service'
import { CardModule } from 'primeng/card'
import { CommonModule } from '@angular/common'
import { DropdownModule } from 'primeng/dropdown'
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner'
import { ButtonModule } from 'primeng/button'
import { TableModule } from 'primeng/table'
import { InputNumberModule } from 'primeng/inputnumber'
import { FormsModule } from '@angular/forms'
import { InputTextareaModule } from 'primeng/inputtextarea'
import { InputTextModule } from 'primeng/inputtext'
import { TooltipModule } from 'primeng/tooltip'
import { DialogModule } from 'primeng/dialog'
import { HttpErrorResponse } from '@angular/common/http'
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
  selector: 'app-productos',
  standalone: true,
  imports: [
    CardModule,
    CommonModule,
    DropdownModule,
    NgxSpinnerModule,
    ButtonModule,
    TableModule,
    InputNumberModule,
    FormsModule,
    InputTextareaModule,
    InputTextModule,
    TooltipModule,
    DialogModule,
    DropdownModule
  ],
  templateUrl: './productos.component.html',
  styleUrl: './productos.component.scss'
})

export class ProductosComponent {
  fileName: string = 'Informe.xlsx'
  listImp: SelectItem[] | undefined
  imp = null
  filas: number = 0
  columnas: any[] = []
  info: any[] = []
  loading: boolean = false
  titleModal: string = 'Agregar Producto'
  textBottom: string = 'Agregar'
  lbBtnModal: string = 'Cancelar'
  btnClean: string = 'Limpiar'
  op: string = 'Add'
  href: string = ''
  visible: boolean = false

  // ✅Icono para sin imagen
  iconoNoImg = `${ window.location.href }assets/img/no-image-icon.png`

  // ✅Campos Productos
  idProd: number = 0
  nombreProd: string = ''
  precioProd: number | undefined
  cantProd: number | undefined
  gancProd: number | undefined

  constructor(
    private api: ProductosService,
    private apiImp: ImpuestoService,
    private spinner: NgxSpinnerService,
    private primengConfig: PrimeNGConfig
  ) {
    // ✅ Iniciamos las variables para la tabla
    this.filas = 10
    this.columnas = [
      { field: 'nombre_prod', header: 'Nombre'},
      { field: 'cant_prod', header: 'Cant' },
      { field: 'precio_prod', header: 'Costo' },
      { field: 'imp_prod', header: 'Impuesto' },
      { field: 'ganancia_prod', header: 'Utilidad' },
      { field: '', header: 'Acciones' }
    ]
  }

  async ngOnInit(): Promise<void> {
    this.primengConfig.ripple = true
    this.load(true)
    await this.poblarTabla()
    await this.listarImp()
    this.load(false)
  }

  async poblarTabla() {
    this.load(true)
    this.api.getProducts().subscribe(async (data: any) => {
      this.info = data
    }, (err: HttpErrorResponse) => {
      swalAnimate.fire('Error!', `${ err.message }`, 'error')
    }, () => this.load(false))
  }

  open() {
    this.clean()
    this.titleModal = 'Agregar Producto'
    this.textBottom = 'Agregar'
    this.op = 'Add'
    this.showDialog()
  }

  openUpdate(producto: any) {
    this.titleModal = 'Editar Producto'
    this.textBottom = 'Editar'
    this.op = 'Edit'
    this.idProd = producto.id_prod
    this.nombreProd = producto.nombre_prod
    this.precioProd = producto.precio_prod
    this.cantProd = producto.cant_prod
    this.imp = producto.imp_prod
    this.gancProd = producto.ganancia_prod
    this.showDialog()
  }

  async listarImp() {
    this.load(true)
    this.listImp = [{'value': null, 'label': 'Seleccione Impuesto'}]
    this.apiImp.getImpuesto().subscribe((data: any) => {
      for (let i = 0; i < data.length; i++) {
        this.listImp!.push({'value': data[i].id, 'label': data[i].descripcion + ' - %' + (data[i].impuesto*100).toString()})
      }

      this.imp = this.listImp![0].value
    }, (err: HttpErrorResponse) => {
      swalAnimate.fire('Error!', `${ err.message }`, 'error')
    }, () => this.load(false))
  }

  async agregarProd() {
    if (this.nombreProd == '' || this.precioProd == null || this.cantProd == 0 || this.imp == null || this.gancProd == null) {
      swalAnimate.fire({
        position: 'bottom-end',
        icon: 'warning',
        title: 'Debe llenar los campos obligatorios(Nombre, Costo, Cantidad, Impuesto y Utilidad)!',
        showConfirmButton: false,
        timer: 2000,
        toast: true
      })
    } else {
      if (this.info.findIndex(x => x.nombre_prod === this.nombreProd) != -1) {
        swalAnimate.fire({
          position: 'bottom-end',
          icon: 'warning',
          title: 'Ya tiene registrado este producto!',
          showConfirmButton: false,
          timer: 2000,
          toast: true
        })
      } else {
        let object = {
          nombre_prod: this.nombreProd,
          cant_prod: this.cantProd,
          precio_prod: this.precioProd,
          imp_prod: this.imp,
          ganancia_prod: this.gancProd
        }

        this.load(true)
        this.api.insertProd(object).subscribe((data: any) => {
          if (data['status']) {
            swalAnimate.fire({
              position: 'top-end',
              icon: 'success',
              title: data['mgs'],
              showConfirmButton: false,
              timer: 2000
            }).then(async () => {
              await this.poblarTabla()
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

  async editarProd() {
    if (this.idProd == 0 || this.nombreProd == '' || this.precioProd == null || this.cantProd == 0 || this.imp == null || this.gancProd == null) {
      swalAnimate.fire({
        position: 'bottom-end',
        icon: 'warning',
        title: 'Debe llenar los campos obligatorios(Nombre, Costo, Cantidad, Impuesto y Utilidad)!',
        showConfirmButton: false,
        timer: 2000,
        toast: true
      })
    } else {
      let validateName = this.info.findIndex(x => x.nombre_prod === this.nombreProd)
      if ((validateName != -1) && (this.info[validateName].id_prod != this.idProd)) {
        swalAnimate.fire({
          position: 'bottom-end',
          icon: 'warning',
          title: 'Ya tiene registrado este producto!',
          showConfirmButton: false,
          timer: 2000,
          toast: true
        })
      } else {
        let object = {
          nombre_prod: this.nombreProd,
          cant_prod: this.cantProd,
          precio_prod: this.precioProd,
          imp_prod: this.imp,
          ganancia_prod: this.gancProd
        }

        this.load(true)
        this.api.updateProd(this.idProd, object).subscribe((data: any) => {
          if (data['status']) {
            swalAnimate.fire({
              position: 'top-end',
              icon: 'success',
              title: data['mgs'],
              showConfirmButton: false,
              timer: 2000
            }).then(async () => {
              await this.poblarTabla()
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

  async deleteProd(id: any) {
    swalAnimate.fire({
      title: 'Esta seguro de realizar esta accion?',
      text: 'Se va a eliminar el Producto!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Eliminar',
      confirmButtonColor: '#d33',
      cancelButtonText: 'Cancelar',
      cancelButtonColor: '#B9B6B5',
    }).then(async (result) => {
      if (result.value) {
        this.load(true)
        this.api.deleteProd(id).subscribe((data: any) => {
          if (data['status']) {
            swalAnimate.fire({
              position: 'top-end',
              icon: 'success',
              title: data['mgs'],
              showConfirmButton: false,
              timer: 2000
            }).then(async () => {
              await this.poblarTabla()
            })
          } else {
            swalAnimate.fire('Cuidado!', data['mgs'], 'warning')
            this.poblarTabla()
          }
        }, (err: HttpErrorResponse) => {
          swalAnimate.fire('Error!', `${ err.message }`, 'error')
        }, () => (this.load(false), this.closeDialog()))
      }
    })
  }

  clean() {
    this.nombreProd = ''
    this.precioProd = 0
    this.cantProd = 1
    this.imp = this.listImp![0].value
    this.gancProd = 0
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

  descargarCSV(data: any, filename = 'data') {
    let csvData = this.ConvertToCSV(data, [ 'Nombre', 'Cantidad', 'Costo', 'Impuesto', 'Utilidad', 'Fecha'],
    ['nombre_prod', 'cant_prod', 'precio_prod', 'imp_prod', 'ganancia_prod', 'fecha_prod'])
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
    let formato: any = ''
    this.info.forEach(element => {
      formato = this.formatearFecha(new Date(element.fecha_prod))
      let params = {
        nombre_prod: element.nombre_prod,
        cant_prod: element.cant_prod,
        precio_prod: element.precio_prod,
        imp_prod: element.impuesto,
        ganancia_prod: element.ganancia_prod,
        fecha_prod: formato.fecha
      }
      inform.push(params)
    })
    // Obtenemos el json
    const ws = XLSX.utils.json_to_sheet(inform)
    // Asignamos nombre a las columnas
    ws['A1'].v = "Nombre"
    ws['B1'].v = "Cantidad"
    ws['C1'].v = "Costo"
    ws['D1'].v = "Impuesto"
    ws['E1'].v = "Utilidad"
    ws['F1'].v = "Fecha"

    // Generamos el libro y agregamos loas hojas
    const wb: XLSX.WorkBook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'Informe Productos')

    // Guardamos en el archivo
    XLSX.writeFile(wb, this.fileName)
  }

  // Formato deseado de la fecha
  formatearFecha(date: any) {
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
