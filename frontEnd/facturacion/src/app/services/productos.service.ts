import { HttpClient, HttpHeaders } from '@angular/common/http'
import { inject, Injectable } from '@angular/core'
import { Observable, map } from 'rxjs'
import { environment as env } from '../../environments/environment'

@Injectable({
  providedIn: 'root'
})
export class ProductosService {
  /**
   *  Obtiene los productos
   *  @author David Alexis
  */

  private readonly http = inject(HttpClient)

  // ✅ Obtiene los productos
  getProducts(): Observable<any[]> {
    return this.http.get(`${ env.urlAPIProd }getProducts`).pipe(
      map((response: any)=> response)
    )
  }

  // ✅ Agrega un producto
  insertProd(object: any) {
    const headers = new HttpHeaders().set('Content-Type', 'application/json')
    const data = { object: object }
    return this.http.post(`${ env.urlAPIProd }insertProd`, JSON.stringify(data), {headers: headers}).pipe(
      map((response: any)=> response)
    )
  }

  // ✅ Actualiza un producto
  updateProd(id: any, object: any) {
    const headers = new HttpHeaders().set('Content-Type', 'application/json')
    const data = { object: object }
    return this.http.put(`${ env.urlAPIProd }updateProd/${id}`, JSON.stringify(data), {headers: headers}).pipe(
      map((response: any)=> response)
    )
  }

  // ✅ Actualiza un producto
  prodControl(id: any, cant: any) {
    const headers = new HttpHeaders().set('Content-Type', 'application/json')
    const data = { cant: cant }
    return this.http.put(`${ env.urlAPIProd }updateProdCont/${id}`, JSON.stringify(data), {headers: headers}).pipe(
      map((response: any)=> response)
    )
  }

  // ✅ Elimina un producto
  deleteProd(id: any) {
    return this.http.delete(`${ env.urlAPIProd }deleteProd/${id}`).pipe(
      map((response: any)=> response)
    )
  }
}
