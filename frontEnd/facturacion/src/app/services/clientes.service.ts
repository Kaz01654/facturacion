import { HttpClient, HttpHeaders } from '@angular/common/http'
import { inject, Injectable } from '@angular/core'
import { Observable, map } from 'rxjs'
import { environment as env } from '../../environments/environment'

@Injectable({
  providedIn: 'root'
})

export class ClientesService {
  /**
   *  Obtiene los clientes
   *  @author David Alexis
  */

  private readonly http = inject(HttpClient)

  // ✅ Obtiene los Clientes
  getClients(): Observable<any[]> {
    return this.http.get(`${ env.urlAPIClt }getClients`).pipe(
      map((response: any)=> response)
    )
  }

  // ✅ Agrega un cliente
  insertClient(object: any) {
    const headers = new HttpHeaders().set('Content-Type', 'application/json')
    const data = { object: object }
    return this.http.post(`${ env.urlAPIClt }insertClient`, JSON.stringify(data), {headers: headers}).pipe(
      map((response: any)=> response)
    )
  }

  // ✅ Actualiza un cliente
  updateClient(id: any, object: any) {
    const headers = new HttpHeaders().set('Content-Type', 'application/json')
    const data = { object: object }
    return this.http.put(`${ env.urlAPIClt }updateClient/${id}`, JSON.stringify(data), {headers: headers}).pipe(
      map((response: any)=> response)
    )
  }

  // ✅ Elimina un cliente
  deleteClient(id: any) {
    return this.http.delete(`${ env.urlAPIClt }deleteClient/${id}`).pipe(
      map((response: any)=> response)
    )
  }
}
