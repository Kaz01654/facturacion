import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class GastosService {

  constructor(private http: HttpClient) { }
  /**
   *  Obtiene los gastos
   *  @author David Alexis
  */

  //Obtiene los gastos
  getGastos() {
    return this.http.get(`${ environment.urlAPIGast }getGastos`).toPromise().then(res => { return res; });
  }

  //Obtiene los gastos por fecha
  getGastosByDate(fecha) {
    return this.http.get(`${ environment.urlAPIGast }getGastosByDate/${fecha}`).toPromise().then(res => { return res; });
  }

  //Agrega un gasto
  insertGasto(object) {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    const data = { object: object };
    return this.http.post(`${ environment.urlAPIGast }insertGasto`, JSON.stringify(data), {headers: headers}).toPromise().then(res => { return res; });
  }

  //Actualiza un gasto
  updateGasto(id, object) {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    const data = { object: object };
    return this.http.put(`${ environment.urlAPIGast }updateGasto/${id}`, JSON.stringify(data), {headers: headers}).toPromise().then(res => { return res; });
  }

  //Elimina un gasto
  deleteGasto(id) {
    return this.http.delete(`${ environment.urlAPIGast }deleteGasto/${id}`).toPromise().then(res => { return res; });
  }
}
