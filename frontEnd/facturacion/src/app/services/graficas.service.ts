import { HttpClient } from '@angular/common/http'
import { inject, Injectable } from '@angular/core'
import { Observable, map } from 'rxjs'
import { environment as env } from '../../environments/environment'

@Injectable({
  providedIn: 'root'
})
export class GraficasService {
  /**
   *  Obtiene las graficas
   *  @author David Alexis
  */

  private readonly http = inject(HttpClient)

  // ✅ Obtiene los años
  getYears(): Observable<any[]> {
    return this.http.get(`${ env.urlAPIGraf }getYears`).pipe(
      map((response: any)=> response)
    )
  }

  // ✅ Obtiene los años
  getGastosByYear(year: any): Observable<any[]> {
    return this.http.get(`${ env.urlAPIGraf }getGastosByYear/${year}`).pipe(
      map((response: any)=> response)
    )
  }
}
