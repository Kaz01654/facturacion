import { HttpClient, HttpHeaders } from '@angular/common/http'
import { inject, Injectable } from '@angular/core'
import { Observable, map } from 'rxjs'
import { environment as env } from '../../environments/environment'

@Injectable({
  providedIn: 'root'
})
export class ImpuestoService {
  /**
   *  Obtiene los impuestos
   *  @author David Alexis
  */

  private readonly http = inject(HttpClient)

  // ✅ Obtiene los impuestos
  getImpuesto(): Observable<any[]> {
    return this.http.get(`${ env.urlAPIImp }getImpuesto`).pipe(
      map((response: any)=> response)
    )
  }

  // ✅ Agrega un impuesto
  insertImp(object: any) {
    const headers = new HttpHeaders().set('Content-Type', 'application/json')
    const data = { object: object }
    return this.http.post(`${ env.urlAPIImp }insertImp`, JSON.stringify(data), {headers: headers}).pipe(
      map((response: any)=> response)
    )
  }

  // ✅ Actualiza un impuesto
  updateImp(id: any, object: any) {
    const headers = new HttpHeaders().set('Content-Type', 'application/json')
    const data = { object: object }
    return this.http.put(`${ env.urlAPIImp }updateImp/${id}`, JSON.stringify(data), {headers: headers}).pipe(
      map((response: any)=> response)
    )
  }

  // ✅ Elimina un impuesto
  deleteImp(id: any) {
    return this.http.delete(`${ env.urlAPIImp }deleteImp/${id}`).pipe(
      map((response: any)=> response)
    )
  }
}
