import { CommonModule } from '@angular/common'
import { HttpErrorResponse } from '@angular/common/http'
import { Component } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { FacturacionService } from '../../services/facturacion.service'
import { ClientesService } from '../../services/clientes.service'
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner'
import { PrimeNGConfig, SelectItem } from 'primeng/api'
import { CardModule } from 'primeng/card'
import { DialogModule } from 'primeng/dialog'
import { DropdownChangeEvent, DropdownModule } from 'primeng/dropdown'
import { InputNumberInputEvent, InputNumberModule } from 'primeng/inputnumber'
import { InputTextModule } from 'primeng/inputtext'
import { TableModule, TableRowCollapseEvent, TableRowExpandEvent } from 'primeng/table'
import { TooltipModule } from 'primeng/tooltip'
import { ButtonModule } from 'primeng/button'
import { ToggleButtonChangeEvent, ToggleButtonModule } from 'primeng/togglebutton'
import swal from 'sweetalert2'
import { ProductosService } from '../../services/productos.service'

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
  selector: 'app-facturacion',
  standalone: true,
  imports: [
    CardModule,
    TableModule,
    CommonModule,
    DropdownModule,
    FormsModule,
    TooltipModule,
    DialogModule,
    InputTextModule,
    InputNumberModule,
    NgxSpinnerModule,
    ButtonModule,
    ToggleButtonModule
  ],
  templateUrl: './facturacion.component.html',
  styleUrl: './facturacion.component.scss'
})

export class FacturacionComponent {
  listClient: SelectItem[] | undefined
  client = null
  listProd: SelectItem[] | undefined
  prod = null
  filas: number = 0
  columnas: any[] = []
  filasItems: number = 0
  columnasItems: any[] = []
  itemsArr: any[] = []
  info: any[] = []
  infoClientes: any[] = []
  infoProd: any[] = []
  loading: boolean = false
  titleModal: string = 'Nueva Factura'
  textBottom: string = 'Procesar'
  lbBtnModal: string = 'Cancelar'
  btnClean: string = 'Limpiar'
  op: string = 'Add'
  href: string = ''
  visible: boolean = false
  checked: boolean = false
  iconOff: string = 'pi pi-user-plus'
  iconOn: string = 'pi pi-users'


  // ✅Campos Facturas
  id_fact: number = 0
  cliente_fact: string = ''
  sub_total_fact: number | undefined
  tax_fact: number | undefined
  total_fact: number | undefined
  pago_fact: number | undefined
  saldo_fact: number | undefined
  items_fact: string | undefined
  fecha_fact: string | undefined
  direccionClient: string = ''
  correoClient: string = ''
  contactoClient: string = ''
  rtnClient: string = ''

  constructor(
    private apiFactura: FacturacionService,
    private apiClientes: ClientesService,
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
      clear: 'Borrar'
    })

    // ✅ Iniciamos las variables para la tabla
    this.filasItems = 10
    this.columnasItems = [
      { field: 'nombre_item', header: 'Item' },
      { field: 'cant_item', header: 'Cantidad' },
      { field: 'precio_item', header: 'Precio' },
      { field: 'total_item', header: 'Total' },
      { field: '', header: 'Acciones' }
    ]
  }

  async ngOnInit(): Promise<void> {
    this.primengConfig.ripple = true
    this.load(true)
    await this.poblarTabla()
    await this.listarClientes()
    await this.getProd()
    this.load(false)
  }

  onRowExpand(event: TableRowExpandEvent) {
    // this.messageService.add({ severity: 'info', summary: 'Product Expanded', detail: event.data.name, life: 3000 });
  }

  onRowCollapse(event: TableRowCollapseEvent) {
      // this.messageService.add({ severity: 'success', summary: 'Product Collapsed', detail: event.data.name, life: 3000 });
  }

  open() {
    this.clean()
    this.titleModal = 'Nueva Factura'
    this.textBottom = 'Procesar'
    this.op = 'Add'
    this.showDialog()
  }

  openUpdate(factura: any) {
    this.titleModal = 'Editar Factura'
    this.textBottom = 'Editar'
    this.op = 'Edit'
    this.id_fact = factura.id_fact
    this.cliente_fact = factura.cliente_fact
    this.total_fact = factura.total_fact
    this.items_fact = factura.items_fact
    this.fecha_fact = factura.fecha_fact
    this.showDialog()
  }

  handleOnChange(e: DropdownChangeEvent) {
    if (e.value) {
      let position = this.infoClientes.findIndex(x => x.id === e.value)
      this.direccionClient = this.infoClientes[position].direccion
      this.contactoClient = this.infoClientes[position].contacto
      this.correoClient = this.infoClientes[position].correo
      this.rtnClient = this.infoClientes[position].rtn
    } else {
      this.cleanClientes()
    }
  }

  handleOnChangeToggle(e: ToggleButtonChangeEvent) {
      this.cleanClientes()
  }

  addItem() {
    this.itemsArr.push(
      {
        id_item: 0,
        nombre_item: '',
        cant_item: 1,
        cant_total_item: 1,
        precio_item: 0,
        total_item: 0,
        tipo: true
      }
    )
  }

  async addItemProd(e: DropdownChangeEvent) {
    if (e) {
      let obj = await this.infoProd[this.infoProd.findIndex(x => x.id_prod == e)]
      let pos = this.listProd!.findIndex(x => x.value == e)
      let str = this.listProd![pos].label
      let cant = str!.split('-', 2)
      let cantSelect = Number(cant[1]) - 1

      if (cantSelect >= 0) {
        this.listProd![pos].label = obj.nombre_prod + ' - ' + cantSelect.toString()
        this.itemsArr.push(
          {
            id_item: obj.id_prod,
            nombre_item: obj.nombre_prod,
            cant_item: 1,
            cant_total_item: Number(obj.cant_prod),
            precio_item: Number(obj.precio_prod),
            total_item: Number(obj.precio_prod),
            tipo: false
          }
        )

        this.sumaSubTotal()
      } else {
        swalAnimate.fire('Cuidado!',  `El producto ${obj.nombre_prod} tiene ${cant[1]} en existencia!`, 'warning')
      }
    }
  }

  deleteItem(item: any) {
    let indexOf = this.itemsArr.indexOf(item)
    let cantItem = this.itemsArr[indexOf].cant_item

    if (indexOf !== -1) {
      this.itemsArr.splice(indexOf, 1)
      if (!item.tipo) {
        this.prod = this.listProd![0].value
        let pos = this.listProd!.findIndex(x => x.value == item.id_item)
        let str = this.listProd![pos].label
        let cant = str!.split('-', 2)
        let cantTotal = Number(cant[1]) + Number(cantItem)
        this.listProd![pos].label = item.nombre_item + ' - ' + cantTotal.toString()
      }
      this.sumaSubTotal()
    }
  }

  operationCant(e: InputNumberInputEvent, item: any) {
    if (e) {
      this.prod = this.listProd![0].value
      let obj = this.infoProd[this.infoProd.findIndex(x => x.id_prod == item.id_item)]
      let indexOf = this.itemsArr.indexOf(item)

      if (indexOf !== -1) {
        this.itemsArr[indexOf].total_item = this.itemsArr[indexOf].precio_item * Number(e.value)
        let pos = this.listProd!.findIndex(x => x.value == item.id_item)
        let cant = this.itemsArr.reduce((accum, { id_item, cant_item }, index, arr) => {
          if (id_item == item.id_item && index != indexOf) {
            return accum + cant_item
          } else {
            return accum
          }
        }, 0)
        let res = Number(obj.cant_prod) - Number(e.value) - Number(cant)

        if (res >= 0) {
          this.listProd![pos].label = item.nombre_item + ' - ' + res.toString()
          this.sumaSubTotal()
        } else {
          this.itemsArr[indexOf].cant_item -= 1
          this.itemsArr[indexOf].total_item = this.itemsArr[indexOf].precio_item * this.itemsArr[indexOf].cant_item
          this.sumaSubTotal()
          swalAnimate.fire('Cuidado!',  `Estas sobrepasando la cantidad de ${obj.nombre_prod} que hay en existencia!`, 'warning')
        }
      }
    }
  }

  operationPrecio(e: InputNumberInputEvent, item: any) {
    if (e) {
      let indexOf = this.itemsArr.indexOf(item)
      if (indexOf !== -1) {
        this.itemsArr[indexOf].total_item = this.itemsArr[indexOf].cant_item * Number(e.value)
        this.sumaSubTotal()
      }
    }
  }

  async sumaSubTotal() {
    this.sub_total_fact = await this.itemsArr.reduce((accum, item) => accum + item.total_item, 0)
    this.tax_fact = Number(this.sub_total_fact) * 0.30
    this.total_fact = Number(this.sub_total_fact) + Number(this.tax_fact)
  }

  clearItems() {
    this.itemsArr = []
    this.sub_total_fact = 0
    this.tax_fact = 0
    this.total_fact = 0
    this.pago_fact = 0
    this.saldo_fact = 0
    this.resetProd()
  }

  resetProd() {
    this.listProd = [{'value': null, 'label': 'Seleccione Producto'}]
    this.infoProd.forEach((val, key) => {
      this.listProd!.push({'value': val.id_prod, 'label': val.nombre_prod + ' - ' + val.cant_prod})
    })
    this.prod = this.listProd![0].value
  }

  async poblarTabla() {
    this.load(true)
    this.apiFactura.getFacturas().subscribe(async (data: any) => {
      this.info = data
    }, (err: HttpErrorResponse) => {
      swalAnimate.fire('Error!', `${ err.message }`, 'error')
    }, () => this.load(false))
  }

  async listarClientes() {
    this.load(true)
    this.listClient = [{'value': null, 'label': 'Seleccione Cliente'}]
    this.apiClientes.getClients().subscribe((data: any) => {
      this.infoClientes = data
      for (let i = 0; i < data.length; i++) {
        this.listClient!.push({'value': data[i].id, 'label': data[i].nombre})
      }
      this.client = this.listClient![0].value
    }, (err: HttpErrorResponse) => {
      swalAnimate.fire('Error!', `${ err.message }`, 'error')
    }, () => this.load(false))
  }

  async getProd() {
    this.load(true)
    this.listProd = [{'value': null, 'label': 'Seleccione Producto'}]
    this.apiProd.getProducts().subscribe((data: any) => {
      this.infoProd = data
      for (let i = 0; i < data.length; i++) {
        this.listProd!.push({'value': data[i].id_prod, 'label': data[i].nombre_prod + ' - ' + data[i].cant_prod})
      }
      this.prod = this.listProd![0].value
    }, (err: HttpErrorResponse) => {
      swalAnimate.fire('Error!', `${ err.message }`, 'error')
    }, () => this.load(false))
  }

  async agregarFact() {
    if (this.cliente_fact == '' || this.total_fact == null || this.items_fact == '') {
      swalAnimate.fire({
        position: 'bottom-end',
        icon: 'warning',
        title: 'Debe llenar los campos obligatorios(Cliente, Items)!',
        showConfirmButton: false,
        timer: 2000,
        toast: true
      })
    } else {
      let object = {
        cliente_fact: this.cliente_fact,
        total_fact: this.total_fact,
        items_fact: this.items_fact
      }

      this.load(true)
      this.apiFactura.insertFactura(object).subscribe((data: any) => {
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

  async editarFact() {
    if (this.id_fact == 0 || this.cliente_fact == '' || this.items_fact == null) {
      swalAnimate.fire({
        position: 'bottom-end',
        icon: 'warning',
        title: 'Debe llenar los campos obligatorios(Cliente, Items)!',
        showConfirmButton: false,
        timer: 2000,
        toast: true
      })
    } else {
      let object = {
        cliente_fact: this.cliente_fact,
        total_fact: this.total_fact,
        items_fact: this.items_fact
      }

      this.load(true)
      this.apiFactura.updateFactura(this.id_fact, object).subscribe((data: any) => {
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

  async deleteFact(id: any) {
    swalAnimate.fire({
      title: 'Esta seguro de realizar esta accion?',
      text: 'Se va a eliminar la factura!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Eliminar',
      confirmButtonColor: '#d33',
      cancelButtonText: 'Cancelar',
      cancelButtonColor: '#B9B6B5',
    }).then(async (result) => {
      if (result.value) {
        this.load(true)
        this.apiFactura.deleteFactura(id).subscribe((data: any) => {
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
    this.direccionClient = ''
    this.contactoClient = ''
    this.correoClient = ''
    this.rtnClient = ''
    this.cliente_fact = ''
    this.sub_total_fact = 0
    this.tax_fact = 0
    this.total_fact = 0
    this.pago_fact = 0
    this.saldo_fact = 0
    this.items_fact = ''
    this.client = this.listClient![0].value
    this.fecha_fact = undefined
  }

  cleanClientes() {
    this.direccionClient = ''
    this.contactoClient = ''
    this.correoClient = ''
    this.rtnClient = ''
    this.cliente_fact = ''
    this.client = this.listClient![0].value
  }

  cleanFactura() {
    this.direccionClient = ''
    this.contactoClient = ''
    this.correoClient = ''
    this.rtnClient = ''
    this.cliente_fact = ''
    this.items_fact = ''
    this.client = this.listClient![0].value
    this.fecha_fact = undefined
    this.clearItems()
  }

  // ✅ Formato deseado de la fecha
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