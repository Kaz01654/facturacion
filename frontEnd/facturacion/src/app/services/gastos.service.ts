import { HttpClient, HttpHeaders } from '@angular/common/http'
import { inject, Injectable } from '@angular/core'
import { Observable, map } from 'rxjs'
import { environment as env } from '../../environments/environment'

@Injectable({
  providedIn: 'root'
})
export class GastosService {
  /**
   *  Obtiene los gastos
   *  @author David Alexis
  */

  private readonly http = inject(HttpClient)

  // ✅ Obtiene los gastos
  getGastos(): Observable<any[]> {
    return this.http.get(`${ env.urlAPIGast }getGastos`).pipe(
      map((response: any)=> response)
    )
  }

  // ✅ Obtiene los gastos por fecha
  getGastosByDate(fecha: string): Observable<any[]> {
    return this.http.get(`${ env.urlAPIGast }getGastosByDate/${fecha}`).pipe(
      map((response: any)=> response)
    )
  }

  // ✅ Agrega un gasto
  insertGasto(object: any) {
    const headers = new HttpHeaders().set('Content-Type', 'application/json')
    const data = { object: object }
    return this.http.post(`${ env.urlAPIGast }insertGasto`, JSON.stringify(data), {headers: headers}).pipe(
      map((response: any)=> response)
    )
  }

  // ✅ Actualiza un gasto
  updateGasto(id: any, object: any) {
    const headers = new HttpHeaders().set('Content-Type', 'application/json')
    const data = { object: object }
    return this.http.put(`${ env.urlAPIGast }updateGasto/${id}`, JSON.stringify(data), {headers: headers}).pipe(
      map((response: any)=> response)
    )
  }

  // ✅ Elimina un gasto
  deleteGasto(id: any) {
    return this.http.delete(`${ env.urlAPIGast }deleteGasto/${id}`).pipe(
      map((response: any)=> response)
    )
  }
}
