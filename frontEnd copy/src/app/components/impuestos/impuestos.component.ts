import { Component, OnInit } from '@angular/core';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { ImpuestoService } from 'src/app/services/impuesto.service';
import { NgxSpinnerService } from "ngx-spinner";
import swal from 'sweetalert2';

@Component({
  selector: 'app-impuestos',
  templateUrl: './impuestos.component.html',
  styleUrls: ['./impuestos.component.css'],
  providers: [NgbModalConfig, NgbModal]
})
export class ImpuestosComponent implements OnInit {
  filas: number = 0;
  columnas: any[] = [];
  info: any[] = [];
  loading: boolean = false;
  titleModal: string = 'Agregar Producto';
  textBottom: string = 'Agregar';
  lbBtnModal: string = 'Cancelar';
  btnClean: string = 'Limpiar';
  op: string = 'Add';

  //Campos Impuesto
  idImp: number = 0;
  descImp: string = '';
  impImp: number;

  constructor(
    private apiImp: ImpuestoService,
    private spinner: NgxSpinnerService,
    private modalService: NgbModal,
    config: NgbModalConfig
  ) {
    // Iniciamos las variables para la tabla
    this.filas = 10;
    this.columnas = [
      { field: 'descripcion', header: 'Descripcion'},
      { field: 'impuesto', header: 'Impuesto'},
      { field: 'fecha', header: 'Fecha' },
      { field: '', header: 'Acciones' }
    ];

    //Configuracion modal
    config.backdrop = 'static';
    config.keyboard = false;
    config.centered = true;
    config.size = 'lg';
    config.windowClass = 'dark-modal';
  }

  async ngOnInit(): Promise<void> {
    this.spinner.show();
    await Promise.all([
      this.poblarTabla()
    ]);
    this.spinner.hide();
  }

  async poblarTabla() {
    await this.apiImp.getImpuesto().then((data: any) => {
      this.info = data;
    }, (error) => {
      swal.fire('Error!', `${ error.statusText }`, 'error')
    })
  }

  open(content) {
    this.clean();
    this.titleModal = 'Agregar Impuesto';
    this.textBottom = 'Agregar';
    this.op = 'Add';
    this.modalService.open(content, {backdropClass: 'light-blue-backdrop'});
  }

  openUpdate(content, impuesto) {
    this.titleModal = 'Editar Impuesto';
    this.textBottom = 'Editar';
    this.op = 'Edit';
    this.idImp = impuesto.id;
    this.descImp = impuesto.descripcion;
    this.impImp = impuesto.impuesto*100;
    this.modalService.open(content, {backdropClass: 'light-blue-backdrop'});
  }

  async agregarImp() {
    if (this.descImp == '' || this.impImp == null) {
      swal.fire({
        position: 'bottom-end',
        icon: 'warning',
        title: 'Debe llenar todos los campos!',
        showConfirmButton: false,
        timer: 2000,
        toast: true
      });
    } else {
      let object = {
        descripcion: this.descImp,
        impuesto: this.impImp/100
      }
      this.loading = true;
      this.spinner.show();
      await this.apiImp.insertImp(object).then((data: any[]) => {
        this.spinner.hide();
        if (data['status']) {
          swal.fire({
            position: 'top-end',
            icon: 'success',
            title: data['mgs'],
            showConfirmButton: false,
            timer: 2000
          }).then(async () => {
            await this.poblarTabla();
            this.loading = false;
            this.modalService.dismissAll();
            this.clean();
          });
        } else {
          swal.fire('Cuidado!', data['mgs'], 'warning');
          this.spinner.hide();
        }
      }, (error) => {
        swal.fire('Error!', `${ error.statusText }`, 'error');
      });
    }
  }

  async editarImp() {
    if (this.descImp == '' || this.impImp == null) {
      swal.fire({
        position: 'bottom-end',
        icon: 'warning',
        title: 'Debe llenar todos los campos!',
        showConfirmButton: false,
        timer: 2000,
        toast: true
      });
    } else {
      let object = {
        descripcion: this.descImp,
        impuesto: this.impImp/100
      }
      this.loading = true;
      this.spinner.show();
      await this.apiImp.updateImp(this.idImp, object).then((data: any[]) => {
        this.spinner.hide();
        if (data['status']) {
          swal.fire({
            position: 'top-end',
            icon: 'success',
            title: data['mgs'],
            showConfirmButton: false,
            timer: 2000
          }).then(async () => {
            await this.poblarTabla();
            this.loading = false;
            this.modalService.dismissAll();
            this.clean();
          });
        } else {
          swal.fire('Cuidado!', data['mgs'], 'warning');
          this.spinner.hide();
        }
      }, (error) => {
        swal.fire('Error!', `${ error.statusText }`, 'error');
      });
    }
  }

  async deleteImp(id) {
    swal.fire({
      title: 'Esta seguro de realizar esta accion?',
      text: 'Se va a eliminar el Impuesto!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Eliminar',
      confirmButtonColor: '#d33',
      cancelButtonText: 'Cancelar',
      cancelButtonColor: '#B9B6B5',
    }).then(async (result) => {
      if (result.value) {
        this.loading = true;
        this.spinner.show();
        await this.apiImp.deleteImp(id).then((data: any) => {
          if (data['status']) {
            swal.fire({
              position: 'top-end',
              icon: 'success',
              title: data['mgs'],
              showConfirmButton: false,
              timer: 2000
            }).then(async () => {
              await this.poblarTabla();
              this.loading = false;
              this.spinner.hide();
            });
          } else {
            swal.fire('Cuidado!', data['mgs'], 'warning');
            this.poblarTabla();
            this.loading = false;
            this.spinner.hide();
          }
        }, (error) => {
          swal.fire('Error!', `${ error.statusText }`, 'error');
        });
      }
    });
  }

  clean() {
    this.descImp = '';
    this.impImp = null;
  }
}
