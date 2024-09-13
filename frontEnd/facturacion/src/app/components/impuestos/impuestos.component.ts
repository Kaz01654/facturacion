import { Component } from '@angular/core'
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner'
import { ImpuestoService } from '../../services/impuesto.service'
import swal from 'sweetalert2'
import { PrimeNGConfig } from 'primeng/api'
import { HttpErrorResponse } from '@angular/common/http'
import { CommonModule } from '@angular/common'
import { TableModule } from 'primeng/table'
import { DialogModule } from 'primeng/dialog'
import { ButtonModule } from 'primeng/button'
import { FormsModule } from '@angular/forms'
import { CardModule } from 'primeng/card'
import { TooltipModule } from 'primeng/tooltip'
import { InputTextModule } from 'primeng/inputtext'
import { InputNumberModule } from 'primeng/inputnumber'

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
  selector: 'app-impuestos',
  standalone: true,
  imports: [
    CommonModule,
    TableModule,
    DialogModule,
    ButtonModule,
    FormsModule,
    NgxSpinnerModule,
    CardModule,
    TooltipModule,
    InputTextModule,
    InputNumberModule
  ],
  templateUrl: './impuestos.component.html',
  styleUrl: './impuestos.component.scss'
})

export class ImpuestosComponent {
  filas: number = 0
  columnas: any[] = []
  info: any[] = []
  loading: boolean = false
  titleModal: string = 'Agregar Producto'
  textBottom: string = 'Agregar'
  lbBtnModal: string = 'Cancelar'
  btnClean: string = 'Limpiar'
  op: string = 'Add'
  visible: boolean = false

  //Campos Impuesto
  idImp: number = 0
  descImp: string = ''
  impImp: number | undefined

  constructor(
    private apiImp: ImpuestoService,
    private spinner: NgxSpinnerService,
    private primengConfig: PrimeNGConfig
  ) {
    // Iniciamos las variables para la tabla
    this.filas = 10
    this.columnas = [
      { field: 'descripcion', header: 'Descripcion'},
      { field: 'impuesto', header: 'Impuesto'},
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
    this.apiImp.getImpuesto().subscribe(async (data: any) => {
      this.info = data
    }, (err: HttpErrorResponse) => {
      swalAnimate.fire('Error!', `${ err.message }`, 'error')
    }, () => this.load(false))
  }

  open() {
    this.clean()
    this.titleModal = 'Agregar Impuesto'
    this.textBottom = 'Agregar'
    this.op = 'Add'
    this.showDialog()
  }

  openUpdate(impuesto: any) {
    this.titleModal = 'Editar Impuesto'
    this.textBottom = 'Editar'
    this.op = 'Edit'
    this.idImp = impuesto.id
    this.descImp = impuesto.descripcion
    this.impImp = impuesto.impuesto*100
    this.showDialog()
  }

  async agregarImp() {
    if (this.descImp == '' || this.impImp == null) {
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
        descripcion: this.descImp,
        impuesto: this.impImp/100
      }

      this.load(true)
      this.apiImp.insertImp(object).subscribe((data: any) => {
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

  async editarImp() {
    if (this.descImp == '' || this.impImp == null) {
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
        descripcion: this.descImp,
        impuesto: this.impImp/100
      }

      this.load(true)
      this.apiImp.updateImp(this.idImp, object).subscribe((data: any) => {
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

  async deleteImp(id: any) {
    swalAnimate.fire({
      title: 'Esta seguro de realizar esta accion?',
      text: 'Se va a eliminar el Impuesto!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Eliminar',
      confirmButtonColor: '#d33',
      cancelButtonText: 'Cancelar',
      cancelButtonColor: '#B9B6B5',
    }).then(async (result: any) => {
      if (result.value) {
        this.load(true)
        this.apiImp.deleteImp(id).subscribe((data: any) => {
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
    this.descImp = ''
    this.impImp = undefined
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
