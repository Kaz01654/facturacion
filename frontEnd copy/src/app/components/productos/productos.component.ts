import { Component, OnInit } from '@angular/core';
import { ProductosService } from './../../services/productos.service';
import { ImpuestoService } from 'src/app/services/impuesto.service';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { DomSanitizer } from '@angular/platform-browser';
import { SelectItem } from 'primeng/api';
import { NgxSpinnerService } from "ngx-spinner";
import swal from 'sweetalert2';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-productos',
  templateUrl: './productos.component.html',
  styleUrls: ['./productos.component.css'],
  providers: [NgbModalConfig, NgbModal]
})
export class ProductosComponent implements OnInit {
  fileName: string = 'Informe.xlsx';
  listImp: SelectItem[];
  imp = null;
  filas: number = 0;
  columnas: any[] = [];
  info: any[] = [];
  loading: boolean = false;
  gallery: boolean = false;
  titleModal: string = 'Agregar Producto';
  textBottom: string = 'Agregar';
  lbBtnModal: string = 'Cancelar';
  btnClean: string = 'Limpiar';
  op: string = 'Add';
  base64: any;
  uploadedFiles: any[] = [];
  imgFile:any = '';

  href: string = "";

  //Icono para sin imagen
  iconoNoImg = `${ window.location.href }assets/img/no-image-icon.png`;

  //Campos Productos
  idProd: number = 0;
  nombreProd: string = '';
  precioProd: number;
  cantProd: number = 1;
  gancProd: number;
  img: any[];
  images: any[] = [];
  imgProducto: any[] = [];
  imgBtoa: any;
  imgBtoaUpdate: any;

  constructor(
    private api: ProductosService,
    private apiImp: ImpuestoService,
    private spinner: NgxSpinnerService,
    private modalService: NgbModal,
    private domSanitizer: DomSanitizer,
    config: NgbModalConfig
  ) {
    // Iniciamos las variables para la tabla
    this.filas = 10;
    this.columnas = [
      { field: 'nombre_prod', header: 'Nombre'},
      { field: 'img_prod', header: 'Foto'},
      { field: 'cant_prod', header: 'Cant' },
      { field: 'precio_prod', header: 'Costo' },
      { field: 'imp_prod', header: 'Impuesto' },
      { field: 'ganancia_prod', header: 'Utilidad' },
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
      this.poblarTabla(),
      this.listarImp()
    ]);
    this.spinner.hide();
  }

  async poblarTabla() {
    await this.api.getProducts().then((data: any) => {
      this.info = data;
    }, (error) => {
      swal.fire('Error!', `${ error.statusText }`, 'error')
    })
  }

  open(content) {
    this.clean();
    this.gallery = false;
    this.titleModal = 'Agregar Producto';
    this.textBottom = 'Agregar';
    this.op = 'Add';
    this.modalService.open(content, {backdropClass: 'light-blue-backdrop'});
  }

  openUpdate(content, producto) {
    this.images = [];
    this.gallery = true;
    this.titleModal = 'Editar Producto';
    this.textBottom = 'Editar';
    this.op = 'Edit';
    this.idProd = producto.id_prod;
    this.nombreProd = producto.nombre_prod;
    this.precioProd = producto.precio_prod;
    this.cantProd = producto.cant_prod;
    this.imp = producto.imp_prod;
    this.gancProd = producto.ganancia_prod;
    this.imgBtoaUpdate = producto.img_prod;
    this.images.push(producto);
    this.modalService.open(content, {backdropClass: 'light-blue-backdrop'});
  }

  openImgModal(content, producto) {
    this.imgProducto = [];
    this.imgProducto.push(producto);
    this.modalService.open(content, {backdropClass: 'light-blue-backdrop', size: 'sm'});
  }

  async listarImp() {
    this.spinner.show();
    this.listImp = [{label: 'Seleccione Impuesto', value: null}];
    await this.apiImp.getImpuesto().then(async (data: any) => {
      for (let i = 0; i < data.length; i++) {
        await this.listImp.push({label: data[i].descripcion + ' - %' + (data[i].impuesto*100).toString(), value: data[i].id});
      }
      this.imp = this.listImp[0].value;
      this.spinner.hide();
    }, (error) => {
      swal.fire('Error!', `${ error.messageError }`, 'error')
    })
  }

  async myUploader(event, files) {
    console.log(event.files);
    this.imgFile = files;
    let fileReader = new FileReader();
    fileReader.readAsDataURL(event.files[0]);
    fileReader.onload = async () => {
      this.base64 = fileReader.result;
      this.imgBtoa = this.imgBtoaUpdate = await btoa(this.base64.split(',')[1])
    };
  }

  async agregarProd() {
    if (this.nombreProd == '' || this.precioProd == null || this.cantProd == 0 || this.imp == null || this.gancProd == null) {
      swal.fire({
        position: 'bottom-end',
        icon: 'warning',
        title: 'Debe llenar los campos obligatorios(Nombre, Costo, Cantidad, Impuesto y Utilidad)!',
        showConfirmButton: false,
        timer: 2000,
        toast: true
      });
    } else {
      if (this.info.findIndex(x => x.nombre_prod === this.nombreProd) != -1) {
        swal.fire({
          position: 'bottom-end',
          icon: 'warning',
          title: 'Ya tiene registrado este producto!',
          showConfirmButton: false,
          timer: 2000,
          toast: true
        });
      } else {
        let object = {
          nombre_prod: this.nombreProd,
          img_prod: (this.imgBtoa) ? this.imgBtoa : '',
          cant_prod: this.cantProd,
          precio_prod: this.precioProd,
          imp_prod: this.imp,
          ganancia_prod: this.gancProd
        }
        this.loading = true;
        this.spinner.show();
        await this.api.insertProd(object).then((data: any[]) => {
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
  }

  async editarProd() {
    if (this.idProd == 0 || this.nombreProd == '' || this.precioProd == null || this.cantProd == 0 || this.imp == null || this.gancProd == null) {
      swal.fire({
        position: 'bottom-end',
        icon: 'warning',
        title: 'Debe llenar los campos obligatorios(Nombre, Costo, Cantidad, Impuesto y Utilidad)!',
        showConfirmButton: false,
        timer: 2000,
        toast: true
      });
    } else {
      let validateName = this.info.findIndex(x => x.nombre_prod === this.nombreProd);
      if ((validateName != -1) && (this.info[validateName].id_prod != this.idProd)) {
        swal.fire({
          position: 'bottom-end',
          icon: 'warning',
          title: 'Ya tiene registrado este producto!',
          showConfirmButton: false,
          timer: 2000,
          toast: true
        });
      } else {
        let object = {
          nombre_prod: this.nombreProd,
          img_prod: (this.imgBtoaUpdate) ? this.imgBtoaUpdate : '',
          cant_prod: this.cantProd,
          precio_prod: this.precioProd,
          imp_prod: this.imp,
          ganancia_prod: this.gancProd
        }
        this.loading = true;
        this.spinner.show();
        await this.api.updateProd(this.idProd, object).then((data: any[]) => {
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
  }

  async deleteProd(id) {
    swal.fire({
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
        this.loading = true;
        this.spinner.show();
        await this.api.deleteProd(id).then((data: any) => {
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
    this.nombreProd = '';
    this.precioProd = null;
    this.cantProd = 1;
    this.imp = this.listImp[0].value;
    this.gancProd = null;
    this.imgBtoa = '';
    this.img = [];
    (this.imgFile) ? this.imgFile.clear(): '';
  }

  ConvertToCSV(objArray, headerList, key) {
    let array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray;
    let str = '';
    let row = '';
    for (let index in headerList) {
      row += headerList[index] + ', ';
    }
    row = row.replace(/,\s*$/, "");
    str += row + '\r\n';
    for (let i = 0; i < array.length; i++) {
      let line = '';
      let j = 0;
      for (let index in key) {
        let head = key[index];
        line += ((j != 0) ? ', ' : '') + array[i][head];
        j++;
      }
      str += line + '\r\n';
    }
    return str;
  }

  descargarCSV(data, filename = 'data') {
    let csvData = this.ConvertToCSV(data, [ 'Nombre', 'Cantidad', 'Costo', 'Impuesto', 'Utilidad', 'Fecha'],
    ['nombre_prod', 'cant_prod', 'precio_prod', 'imp_prod', 'ganancia_prod', 'fecha_prod']);
    let blob = new Blob(['\ufeff' + csvData], {
      type: 'text/csv;charset=utf-8;'
    });
    let dwldLink = document.createElement("a");
    let url = URL.createObjectURL(blob);
    let isSafariBrowser = navigator.userAgent.indexOf('Safari') != -1 && navigator.userAgent.indexOf('Chrome') == -1;

    //if Safari open in new window to save file with random filename.
    if (isSafariBrowser) {
      dwldLink.setAttribute("target", "_blank");
    }
    dwldLink.setAttribute("href", url);
    dwldLink.setAttribute("download", filename + ".csv");
    dwldLink.style.visibility = "hidden";
    document.body.appendChild(dwldLink);
    dwldLink.click();
    document.body.removeChild(dwldLink);
  }

  descargarExcel() {
    let inform: any[] = new Array();
    let formato: any = '';
    this.info.forEach(element => {
      formato = this.formatearFecha(new Date(element.fecha_prod));
      let params = {
        nombre_prod: element.nombre_prod,
        cant_prod: element.cant_prod,
        precio_prod: element.precio_prod,
        imp_prod: element.impuesto,
        ganancia_prod: element.ganancia_prod,
        fecha_prod: formato.fecha
      };
      inform.push(params);
    });
    // Obtenemos el json
    const ws = XLSX.utils.json_to_sheet(inform);
    // Asignamos nombre a las columnas
    ws.A1.v = "Nombre";
    ws.B1.v = "Cantidad";
    ws.C1.v = "Costo";
    ws.D1.v = "Impuesto";
    ws.E1.v = "Utilidad";
    ws.F1.v = "Fecha";

    // Generamos el libro y agregamos loas hojas
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Informe Productos');

    // Guardamos en el archivo
    XLSX.writeFile(wb, this.fileName);
  }

  // Formato deseado de la fecha
  formatearFecha(date) {
    let h = this.addZero(date.getHours());
    let m = this.addZero(date.getMinutes());
    let s = this.addZero(date.getSeconds());
    let anio = date.getFullYear();
    let mes = this.addZero(date.getMonth() + 1);
    let dia = this.addZero(date.getDate());
    let formato = {
      completo: anio + "-" + mes + "-" + dia + " " + h + ":" + m + ":" + s,
      fecha: anio + "-" + mes + "-" + dia,
      hora: h + ":" + m + ":" + s
    }
    return formato;
  }

  addZero(i) {
    if (i < 10) {
      i = "0" + i;
    }
    return i;
  }

  getSafeUrl(url) {
    return this.domSanitizer.bypassSecurityTrustUrl('data:image/png;base64, ' + atob(url));
  }
}
