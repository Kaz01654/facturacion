import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ImpuestoService {

  constructor(private http: HttpClient) { }
  /**
   *  Obtiene los impuestos
   *  @author David Alexis
  */
  //Obtiene los impuestos
  getImpuesto() {
    return this.http.get(`${ environment.urlAPIImp }getImpuesto`).toPromise().then(res => { return res; });
  }

  //Agrega un impuesto
  insertImp(object) {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    const data = { object: object };
    return this.http.post(`${ environment.urlAPIImp }insertImp`, JSON.stringify(data), {headers: headers}).toPromise().then(res => { return res; });
  }

  //Actualiza un impuesto
  updateImp(id, object) {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    const data = { object: object };
    return this.http.put(`${ environment.urlAPIImp }updateImp/${id}`, JSON.stringify(data), {headers: headers}).toPromise().then(res => { return res; });
  }

  //Elimina un impuesto
  deleteImp(id) {
    return this.http.delete(`${ environment.urlAPIImp }deleteImp/${id}`).toPromise().then(res => { return res; });
  }
}
