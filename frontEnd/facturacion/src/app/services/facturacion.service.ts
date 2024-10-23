import { HttpClient, HttpHeaders } from '@angular/common/http'
import { inject, Injectable } from '@angular/core'
import { Observable, map } from 'rxjs'
import { environment as env } from '../../environments/environment'

@Injectable({
  providedIn: 'root'
})

export class FacturacionService {
  /**
   *  Obtiene las facturas
   *  @author David Alexis
  */

  private readonly http = inject(HttpClient)

  // ✅ Obtiene las facturas
  getFacturas(): Observable<any[]> {
    return this.http.get(`${ env.urlAPIFact }getFacturas`).pipe(
      map((response: any)=> response)
    )
  }

  // ✅ Obtiene las facturas por fecha
  getFacturasByDate(fecha: string): Observable<any[]> {
    return this.http.get(`${ env.urlAPIFact }getFacturasByDate/${fecha}`).pipe(
      map((response: any)=> response)
    )
  }

  // ✅ Agrega un factura
  insertFactura(object: any) {
    const headers = new HttpHeaders().set('Content-Type', 'application/json')
    const data = { object: object }
    return this.http.post(`${ env.urlAPIFact }insertFactura`, JSON.stringify(data), {headers: headers}).pipe(
      map((response: any)=> response)
    )
  }

  // ✅ Actualiza un factura
  updateFactura(id: any, object: any) {
    const headers = new HttpHeaders().set('Content-Type', 'application/json')
    const data = { object: object }
    return this.http.put(`${ env.urlAPIFact }updateFactura/${id}`, JSON.stringify(data), {headers: headers}).pipe(
      map((response: any)=> response)
    )
  }

  // ✅ Elimina un factura
  deleteFactura(id: any) {
    return this.http.delete(`${ env.urlAPIFact }deleteFactura/${id}`).pipe(
      map((response: any)=> response)
    )
  }
}
