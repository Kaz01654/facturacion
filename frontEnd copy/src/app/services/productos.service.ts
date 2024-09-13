import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductosService {
  constructor(private http: HttpClient) { }
  /**
   *  Obtiene los productos
   *  @author David Alexis
  */
  //Obtiene los productos
  getProducts() {
    return this.http.get(`${ environment.urlAPIProd }getProducts`).toPromise().then(res => { return res; });
  }

  //Agrega un producto
  insertProd(object) {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    const data = { object: object };
    return this.http.post(`${ environment.urlAPIProd }insertProd`, JSON.stringify(data), {headers: headers}).toPromise().then(res => { return res; });
  }

  //Actualiza un producto
  updateProd(id, object) {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    const data = { object: object };
    return this.http.put(`${ environment.urlAPIProd }updateProd/${id}`, JSON.stringify(data), {headers: headers}).toPromise().then(res => { return res; });
  }

  //Actualiza un producto
  prodControl(id, cant) {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    const data = { cant: cant };
    return this.http.put(`${ environment.urlAPIProd }updateProdCont/${id}`, JSON.stringify(data), {headers: headers}).toPromise().then(res => { return res; });
  }

  //Elimina un producto
  deleteProd(id) {
    return this.http.delete(`${ environment.urlAPIProd }deleteProd/${id}`).toPromise().then(res => { return res; });
  }
}
