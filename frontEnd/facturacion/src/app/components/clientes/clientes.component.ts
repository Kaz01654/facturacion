import { Component } from '@angular/core'
import { ClientesService } from '../../services/clientes.service'
import { HttpErrorResponse } from '@angular/common/http'
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner'
import { PrimeNGConfig } from 'primeng/api'
import { CardModule } from 'primeng/card'
import { FormsModule } from '@angular/forms'
import { TableModule } from 'primeng/table'
import { ButtonModule } from 'primeng/button'
import { InputTextModule } from 'primeng/inputtext'
import { DialogModule } from 'primeng/dialog'
import { TooltipModule } from 'primeng/tooltip'
import { InputTextareaModule } from 'primeng/inputtextarea'
import { CommonModule } from '@angular/common'
import { InputMaskModule } from 'primeng/inputmask'
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
  selector: 'app-clientes',
  standalone: true,
  imports: [
    CardModule,
    CommonModule,
    FormsModule,
    TableModule,
    ButtonModule,
    InputTextModule,
    DialogModule,
    TooltipModule,
    InputTextareaModule,
    InputMaskModule,
    NgxSpinnerModule
  ],
  templateUrl: './clientes.component.html',
  styleUrl: './clientes.component.scss'
})

export class ClientesComponent {
  fileName: string = 'Informe.xlsx'
  filas: number = 0
  columnas: any[] = []
  info: any[] = []
  loading: boolean = false
  titleModal: string = 'Agregar Cliente'
  textBottom: string = 'Agregar'
  lbBtnModal: string = 'Cancelar'
  btnClean: string = 'Limpiar'
  op: string = 'Add'
  href: string = ''
  visible: boolean = false

  // ✅Campos Clientes
  idClient: number = 0
  nombreClient: string = ''
  direccionClient: string = ''
  correoClient: string = ''
  contactoClient: string = ''
  rtnClient: string = ''

  constructor(
    private api: ClientesService,
    private spinner: NgxSpinnerService,
    private primengConfig: PrimeNGConfig
  ) {
    // ✅ Iniciamos las variables para la tabla
    this.filas = 10
    this.columnas = [
      { field: 'nombre', header: 'Nombre'},
      { field: 'direccion', header: 'Direccion' },
      { field: 'correo', header: 'Correo' },
      { field: 'contacto', header: 'Contacto' },
      { field: 'rtn', header: 'RTN' },
      { field: 'fecha', header: 'Fecha' },
      { field: '', header: 'Acciones' }
    ]
  }

  async ngOnInit(): Promise<void> {
    this.primengConfig.ripple = true
    this.load(true)
    await this.poblarTabla()
    this.load(false)
  }

  async poblarTabla() {
    this.load(true)
    this.api.getClients().subscribe(async (data: any) => {
      this.info = data
    }, (err: HttpErrorResponse) => {
      swalAnimate.fire('Error!', `${ err.message }`, 'error')
    }, () => this.load(false))
  }

  open() {
    this.clean()
    this.titleModal = 'Agregar Cliente'
    this.textBottom = 'Agregar'
    this.op = 'Add'
    this.showDialog()
  }

  openUpdate(cliente: any) {
    this.titleModal = 'Editar Cliente'
    this.textBottom = 'Editar'
    this.op = 'Edit'
    this.idClient = cliente.id
    this.nombreClient = cliente.nombre
    this.direccionClient = cliente.direccion
    this.correoClient = cliente.correo
    this.contactoClient = cliente.contacto
    this.rtnClient = cliente.rtn
    this.showDialog()
  }

  async agregarClient() {
    if (this.nombreClient == '') {
      swalAnimate.fire({
        position: 'bottom-end',
        icon: 'warning',
        title: 'Debe llenar los campos obligatorios(Nombre)!',
        showConfirmButton: false,
        timer: 2000,
        toast: true
      })
    } else {
      if (this.info.findIndex(x => x.nombre === this.nombreClient) != -1) {
        swalAnimate.fire({
          position: 'bottom-end',
          icon: 'warning',
          title: 'Ya tiene registrado este cliente!',
          showConfirmButton: false,
          timer: 2000,
          toast: true
        })
      } else {
        let object = {
          nombre: this.nombreClient,
          direccion: this.direccionClient,
          correo: this.correoClient,
          contacto: this.contactoClient,
          rtn: this.rtnClient
        }

        this.load(true)
        this.api.insertClient(object).subscribe((data: any) => {
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

  async editarClient() {
    if (this.idClient == 0 || this.nombreClient == '') {
      swalAnimate.fire({
        position: 'bottom-end',
        icon: 'warning',
        title: 'Debe llenar los campos obligatorios(Nombre)!',
        showConfirmButton: false,
        timer: 2000,
        toast: true
      })
    } else {
      let validateName = this.info.findIndex(x => x.nombre === this.nombreClient)
      if ((validateName != -1) && (this.info[validateName].id != this.idClient)) {
        swalAnimate.fire({
          position: 'bottom-end',
          icon: 'warning',
          title: 'Ya tiene registrado este cliente!',
          showConfirmButton: false,
          timer: 2000,
          toast: true
        })
      } else {
        let object = {
          nombre: this.nombreClient,
          direccion: this.direccionClient,
          correo: this.correoClient,
          contacto: this.contactoClient,
          rtn: this.rtnClient
        }

        this.load(true)
        this.api.updateClient(this.idClient, object).subscribe((data: any) => {
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

  async deleteClient(id: any) {
    swalAnimate.fire({
      title: 'Esta seguro de realizar esta accion?',
      text: 'Se va a eliminar el Cliente!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Eliminar',
      confirmButtonColor: '#d33',
      cancelButtonText: 'Cancelar',
      cancelButtonColor: '#B9B6B5',
    }).then(async (result) => {
      if (result.value) {
        this.load(true)
        this.api.deleteClient(id).subscribe((data: any) => {
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
    this.nombreClient = ''
    this.direccionClient = ''
    this.contactoClient = ''
    this.correoClient = ''
    this.rtnClient = ''
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
    let csvData = this.ConvertToCSV(data, [ 'Nombre', 'Direccion', 'Correo', 'Contacto', 'RTN', 'Fecha'],
    ['nombre', 'direccion', 'Correo', 'Contacto', 'rtn', 'fecha'])
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
      formato = this.formatearFecha(new Date(element.fecha))
      let params = {
        nombre: element.nombre,
        direccion: element.direccion,
        correo: element.correo,
        contacto: element.contacto,
        rtn: element.rtn,
        fecha: formato.fecha
      }
      inform.push(params)
    })
    // Obtenemos el json
    const ws = XLSX.utils.json_to_sheet(inform)
    // Asignamos nombre a las columnas
    ws['A1'].v = "Nombre"
    ws['B1'].v = "Direccion"
    ws['C1'].v = "Correo"
    ws['D1'].v = "Contacto"
    ws['E1'].v = "RTN"
    ws['F1'].v = "Fecha"

    // Generamos el libro y agregamos loas hojas
    const wb: XLSX.WorkBook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'Informe Clientes')

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
