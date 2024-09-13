import { Component, OnInit } from '@angular/core';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { GastosService } from './../../services/gastos.service';
import { ProductosService } from 'src/app/services/productos.service';
import { NgxSpinnerService } from "ngx-spinner";
import { SelectItem } from 'primeng/api';
import swal from 'sweetalert2';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-gastos',
  templateUrl: './gastos.component.html',
  styleUrls: ['./gastos.component.css'],
  providers: [NgbModalConfig, NgbModal]
})
export class GastosComponent implements OnInit {
  fileName: string = 'Informe.xlsx';
  filas: number = 0;
  columnas: any[] = [];
  info: any[] = [];
  infoProd: any[] = [];
  listProd: SelectItem[];
  prod = null;
  loading: boolean = false;
  titleModal: string = 'Agregar Gasto';
  textBottom: string = 'Agregar';
  lbBtnModal: string = 'Cancelar';
  btnClean: string = 'Limpiar';
  fecha_datos : Date = new Date();
  op: string = 'Add';
  es: any;
  total_prod: number = 0;
  total_var: number = 0;
  total_copy: number = 0;
  total_plot: number = 0;
  total_comp: number = 0;
  total_gast: number = 0;
  total_ing: number = 0;
  total_gastos: number = 0;
  total_resultado: number = 0;
  tipo_global: number = 0;
  cat_global: number = 0;

  //Campos Gasto
  id: number = 0;
  desc: string = '';
  valor: number;
  tipo: number;
  cat: number;
  cant: number = 1;
  fecha_op : Date = new Date();

  constructor(
    private api: GastosService,
    private apiProd: ProductosService,
    private spinner: NgxSpinnerService,
    private modalService: NgbModal,
    config: NgbModalConfig
  ) {
    // Parametros para el calendario
    this.es = {
      firstDayOfWeek: 1,
      dayNames: [ "domingo","lunes","martes","miércoles","jueves","viernes","sábado" ],
      dayNamesShort: [ "dom","lun","mar","mié","jue","vie","sáb" ],
      dayNamesMin: [ "D","L","M","X","J","V","S" ],
      monthNames: [ "enero","febrero","marzo","abril","mayo","junio","julio","agosto","septiembre","octubre","noviembre","diciembre" ],
      monthNamesShort: [ "ene","feb","mar","abr","may","jun","jul","ago","sep","oct","nov","dic" ],
      today: 'Hoy',
      clear: 'Todos los registros'
    }

    // Iniciamos las variables para la tabla
    this.filas = 10;
    this.columnas = [
      { field: 'descripcion', header: 'Descripcion'},
      { field: 'valor', header: 'Valor'},
      { field: 'cantidad', header: 'Cantidad'},
      { field: 'fecha_op', header: 'Fecha OP' },
      { field: 'fecha_registro', header: 'Fecha Registro' },
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
      this.getProd(),
      this.poblarTabla(this.fecha_datos)
    ]);
    this.spinner.hide();
  }

  calculos(data) {
    this.total_prod = this.total_var = this.total_copy = this.total_plot = this.total_comp = this.total_gast = this.total_gastos = this.total_ing = this.total_resultado = 0;
    data.forEach(op => {
      switch (op.categoria) {
        case 1:
          this.total_prod += op.valor;
        break;
        case 2:
          this.total_var += op.valor;
        break;
        case 3:
          this.total_copy += op.valor;
        break;
        case 4:
          this.total_plot += op.valor;
        break;
        case 5:
          this.total_comp += op.valor;
        break;
        default:
          this.total_gast += op.valor;
        break;
      }
    })
    this.total_ing = this.total_prod + this.total_copy + this.total_plot + this.total_var;
    this.total_gastos = this.total_gast + this.total_comp;
    this.total_resultado = Math.abs(this.total_ing - this.total_gastos);
  }

  async prodControl(id, cant) {
    await this.apiProd.prodControl(id, cant).then((data: any) => {
      swal.fire({
        position: 'bottom-end',
        icon: 'success',
        title: data['mgs'],
        showConfirmButton: false,
        timer: 2000,
        toast: true
      });
      this.getProd();
    }, (error) => {
      swal.fire('Error!', `${ error.statusText }`, 'error')
    })
  }

  async poblarTabla(fecha = null) {
    this.fecha_datos = fecha;
    if (fecha == '') {
      await this.api.getGastos().then((data: any) => {
        this.info = data;
        this.calculos(this.info);
      }, (error) => {
        swal.fire('Error!', `${ error.statusText }`, 'error')
      })
    } else {
      await this.api.getGastosByDate(this.formatearFecha(fecha).fecha).then((data: any) => {
        this.info = data;
        this.calculos(this.info);
      }, (error) => {
        swal.fire('Error!', `${ error.statusText }`, 'error')
      })
    }
  }

  async getProd() {
    this.listProd = [{label: 'Seleccione Producto', value: null}];
    await this.apiProd.getProducts().then((data: any) => {
      this.infoProd = data;
      for (let i = 0; i < data.length; i++) {
        this.listProd.push({label: data[i].nombre_prod + ' - ' + data[i].cant_prod, value: data[i].id_prod});
      }
      this.prod = this.listProd[0].value;
    }, (error) => {
      swal.fire('Error!', `${ error.statusText }`, 'error')
    })
  }

  open(content, operacion) {
    this.clean();
    this.titleModal = 'Agregar ' + operacion;
    this.textBottom = 'Agregar';
    this.op = 'Add';
    this.tipo_global = (operacion == 'Variado') ? 1 : 2;
    this.cat_global = (operacion == 'Variado') ? 2 : (operacion == 'Compra') ? 5 : 6;
    this.modalService.open(content, {backdropClass: 'light-blue-backdrop'});
  }

  openUpdate(content, op) {
    this.titleModal = 'Editar Variado';
    this.textBottom = 'Editar';
    this.op = 'Edit';
    this.id = op.id;
    this.desc = op.descripcion;
    this.valor = op.valor;
    this.tipo = op.tipo;
    this.cat = op.categoria;
    this.cant = op.cantidad;
    this.fecha_op = new Date(op.fecha_op);
    this.modalService.open(content, {backdropClass: 'light-blue-backdrop'});
  }

  async openCopy() {
    const resp = await swal.fire({
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
    });

    if (resp.isConfirmed) {
      if (resp.value <= 0) {
        swal.fire('Cuidado!', 'La cantidad de copias no puede ser menor o igual a cero!', 'warning');
      } else {
        let object = {
          descripcion: 'Copias',
          valor: resp.value * 1,
          tipo: 1,
          categoria: 3,
          cantidad: resp.value,
          fecha_op: this.formatearFecha(this.fecha_op).completo
        }
        this.loading = true;
        this.spinner.show();
        await this.api.insertGasto(object).then((data: any[]) => {
          this.spinner.hide();
          if (data['status']) {
            swal.fire({
              position: 'top-end',
              icon: 'success',
              title: data['mgs'],
              showConfirmButton: false,
              timer: 2000
            }).then(async () => {
              await this.poblarTabla(this.fecha_datos);
              this.loading = false;
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

  async openPlotter() {
    const resp = await swal.fire({
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
    });

    if (resp.isConfirmed) {
      if (resp.value <= 0) {
        swal.fire('Cuidado!', 'La cantidad de plotter no puede ser menor o igual a cero!', 'warning');
      } else {
        let object = {
          descripcion: 'Plotter',
          valor: resp.value * 70,
          tipo: 1,
          categoria: 4,
          cantidad: resp.value,
          fecha_op: this.formatearFecha(this.fecha_op).completo
        }
        this.loading = true;
        this.spinner.show();
        await this.api.insertGasto(object).then((data: any[]) => {
          this.spinner.hide();
          if (data['status']) {
            swal.fire({
              position: 'top-end',
              icon: 'success',
              title: data['mgs'],
              showConfirmButton: false,
              timer: 2000
            }).then(async () => {
              await this.poblarTabla(this.fecha_datos);
              this.loading = false;
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

  async openCoPoUpdate(info) {
    const resp = await swal.fire({
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
    });

    if (resp.isConfirmed) {
      if (resp.value <= 0) {
        swal.fire('Cuidado!', 'La cantidad de ' + info.descripcion + ' no puede ser menor o igual a cero!', 'warning');
      } else {
        let object = {
          descripcion: info.descripcion,
          valor: resp.value * ((info.categoria == 3)? 1 : 70),
          tipo: info.tipo,
          categoria: info.categoria,
          cantidad: resp.value,
          fecha_op: this.formatearFecha(new Date(info.fecha_op)).completo
        }
        this.loading = true;
        this.spinner.show();
        await this.api.updateGasto(info.id, object).then((data: any[]) => {
          this.spinner.hide();
          if (data['status']) {
            swal.fire({
              position: 'top-end',
              icon: 'success',
              title: data['mgs'],
              showConfirmButton: false,
              timer: 2000
            }).then(async () => {
              await this.poblarTabla(this.fecha_datos);
              this.loading = false;
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

  async openProdUpdate(info) {
    let obj = this.infoProd[this.infoProd.findIndex(x => x.nombre_prod == info.descripcion)];
    const resp = await swal.fire({
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
    });

    if (resp.isConfirmed) {
      if (resp.value <= 0) {
        swal.fire('Cuidado!', 'La cantidad de ' + obj.nombre_prod + ' no puede ser menor o igual a cero!', 'warning');
      } else {
        let object = {
          descripcion: obj.nombre_prod,
          valor: (((parseFloat(obj.precio_prod) * obj.impuesto) + parseFloat(obj.ganancia_prod) + parseFloat(obj.precio_prod)) * Number(resp.value)),
          tipo: info.tipo,
          categoria: info.categoria,
          cantidad: resp.value,
          fecha_op: this.formatearFecha(new Date(info.fecha_op)).completo
        }
        this.loading = true;
        this.spinner.show();
        await this.api.updateGasto(info.id, object).then((data: any[]) => {
          this.spinner.hide();
          if (data['status']) {
            swal.fire({
              position: 'top-end',
              icon: 'success',
              title: data['mgs'],
              showConfirmButton: false,
              timer: 2000
            }).then(async () => {
              await this.poblarTabla(this.fecha_datos);
              await this.prodControl(obj.id_prod, (obj.cant_prod + info.cantidad) - resp.value);
              this.loading = false;
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

  async agregarGasto() {
    if (this.desc == '' || this.fecha_op == null || this.valor == null || this.cant == 0) {
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
        descripcion: this.desc,
        valor: this.valor,
        tipo: this.tipo_global,
        categoria: this.cat_global,
        cantidad: this.cant,
        fecha_op: this.formatearFecha(this.fecha_op).completo
      }
      this.loading = true;
      this.spinner.show();
      await this.api.insertGasto(object).then((data: any[]) => {
        this.spinner.hide();
        if (data['status']) {
          swal.fire({
            position: 'top-end',
            icon: 'success',
            title: data['mgs'],
            showConfirmButton: false,
            timer: 2000
          }).then(async () => {
            await this.poblarTabla(this.fecha_datos);
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

  async editarGasto() {
    if (this.desc == '' || this.fecha_op == null || this.valor == null || this.cant == 0) {
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
        descripcion: this.desc,
        valor: this.valor,
        tipo: this.tipo,
        categoria: this.cat,
        cantidad: this.cant,
        fecha_op: this.formatearFecha(this.fecha_op).completo
      }
      this.loading = true;
      this.spinner.show();
      await this.api.updateGasto(this.id, object).then((data: any[]) => {
        this.spinner.hide();
        if (data['status']) {
          swal.fire({
            position: 'top-end',
            icon: 'success',
            title: data['mgs'],
            showConfirmButton: false,
            timer: 2000
          }).then(async () => {
            await this.poblarTabla(this.fecha_datos);
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

  async deleteGasto(id) {
    swal.fire({
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
        this.loading = true;
        this.spinner.show();
        await this.api.deleteGasto(id).then((data: any) => {
          if (data['status']) {
            swal.fire({
              position: 'top-end',
              icon: 'success',
              title: data['mgs'],
              showConfirmButton: false,
              timer: 2000
            }).then(async () => {
              await this.poblarTabla(this.fecha_datos);
              if (data['data'].categoria == 1) {
                let obj = this.infoProd[this.infoProd.findIndex(x => x.nombre_prod == data['data'].descripcion)];
                await this.prodControl(obj.id_prod, obj.cant_prod + data['data'].cantidad);
              }
              this.loading = false;
              this.spinner.hide();
            });
          } else {
            swal.fire('Cuidado!', data['mgs'], 'warning');
            this.poblarTabla(this.fecha_datos);
            this.loading = false;
            this.spinner.hide();
          }
        }, (error) => {
          swal.fire('Error!', `${ error.statusText }`, 'error');
        });
      }
    });
  }

  async agregarProd(e) {
    if (e) {
      let obj = this.infoProd[this.infoProd.findIndex(x => x.id_prod == e)];
      const resp = await swal.fire({
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
      });

      let object = {
        descripcion: obj.nombre_prod,
        valor: (((parseFloat(obj.precio_prod) * obj.impuesto) + parseFloat(obj.ganancia_prod) + parseFloat(obj.precio_prod)) * Number(resp.value)),
        tipo: 1,
        categoria: 1,
        cantidad: resp.value,
        fecha_op: this.formatearFecha(this.fecha_op).fecha
      }
      this.loading = true;
      this.spinner.show();
      await this.api.insertGasto(object).then((data: any[]) => {
        this.spinner.hide();
        if (data['status']) {
          swal.fire({
            position: 'top-end',
            icon: 'success',
            title: data['mgs'],
            showConfirmButton: false,
            timer: 2000
          }).then(async () => {
            await this.poblarTabla(this.fecha_datos);
            await this.prodControl(obj.id_prod, obj.cant_prod - data['data'].cantidad);
            this.loading = false;
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
    let csvData = this.ConvertToCSV(data, [ 'Descripcion', 'Valor', 'Cantidad', 'Fecha Operacion', 'Fecha Registro'],
    ['descripcion', 'valor', 'cantidad', 'fecha_op', 'fecha_registro']);
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
    this.info.forEach(element => {
      let params = {
        descripcion: element.descripcion,
        valor: element.valor,
        tipo: element.tipo_desc,
        cantidad: element.cantidad,
        fecha_op: this.formatearFecha(new Date(element.fecha_op)).fecha,
        fecha_registro: this.formatearFecha(new Date(element.fecha_registro)).fecha
      };
      inform.push(params);
    });
    // Obtenemos el json
    const ws = XLSX.utils.json_to_sheet(inform);
    // Asignamos nombre a las columnas
    ws.A1.v = "Descripcion";
    ws.B1.v = "Valor";
    ws.C1.v = "Tipo";
    ws.D1.v = "Cantidad";
    ws.E1.v = "Fecha Operacion";
    ws.F1.v = "Fecha Registro";

    // Generamos el libro y agregamos loas hojas
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Informe Operaciones');

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

  clean() {
    this.desc = '';
    this.valor = null;
    this.cant = 1;
    this.prod = this.listProd[0].value;
    this.fecha_op = new Date();
  }
}
