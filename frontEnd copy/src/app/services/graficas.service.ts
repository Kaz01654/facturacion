import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class GraficasService {

  constructor(private http: HttpClient) { }
  /**
   *  Obtiene las graficas
   *  @author David Alexis
  */

  //Obtiene las graficas por año
  getGastosByYear(year) {
    return this.http.get(`${ environment.urlAPIGraf }getGastosByYear/${year}`).toPromise().then(res => { return res; });
  }

  //Obtiene los años
  getYears() {
    return this.http.get(`${ environment.urlAPIGraf }getYears`).toPromise().then(res => { return res; });
  }
}
