import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  API_ACTAS, API_ACTAS_FILTRO, API_DET_ACTA, API_ESTADOS_DET_ACTA, API_GESTOR,
} from '../constants/url.constants';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ActasService {

  constructor(private http: HttpClient) {}

  // SERVICES ACTAS
  getAllActas(listActas: any) {
    return this.http.post(API_ACTAS_FILTRO, listActas).pipe(
      map((resp: any) => {
        console.log('SERV-ACTAS', resp);

        return resp.result;
      })
    );
  };

  crearActa(requesActa: any): Observable<any>{
    return this.http.post(API_ACTAS, requesActa)
  }


  // SERVICE - ACTA
  actualizarActa(idActa: number, requestActa: any) {
    return this.http.put<any>(`${API_ACTAS}/${idActa}`, requestActa);
  }

  // SERVICE - SUB ACTA
  getActaById(idActa: any): Observable<any> {
    return this.http.get(`${API_ACTAS}${idActa}`).pipe(
      map((resp: any) => {
        console.log('SERV_DATA_ACTA_BY_ID', resp.result);

        return resp.result;
      })
    );
  }

  eliminarActa(idAActa: number): Observable<any> {
    return this.http.delete<any>(`${API_ACTAS}/${idAActa}`);
  }

  // DETALLE ACTA - OJO CAMBIAR POR SUBACTAS, FALTA API
  crearSubActa(requestDet: any): Observable<any>{
    return this.http.post(API_DET_ACTA, requestDet)
  }

  getDetActaById(idDetActa: number){
    return this.http.get<any>(`${API_DET_ACTA}/${idDetActa}`).pipe(
      map((resp: any) => {
        return resp.result;
      })
    );
  }

  actualizarDetActa(idDetActa: number, reqDetActa: any){
    return this.http.put(`${API_DET_ACTA}/${idDetActa}`, reqDetActa);
  }


  // SERVICIO ESTADOS DETALLE ACTA
  getAllEstadosDetActa() {
    return this.http.get(`${API_ESTADOS_DET_ACTA}`).pipe(
      map((resp: any) => {
        return resp.result;
      })
    );
  }

  crearDetalleActa(requestDet: any): Observable<any>{
    return this.http.post(API_DET_ACTA, requestDet)
  }

  actualizarEstadosDetActa(idEstado: number, requestActa: any) {
    return this.http.put<any>(`${API_ESTADOS_DET_ACTA}/${idEstado}`, requestActa);
  }

  getEstadosDetActaById(idEstado: any): Observable<any> {
    return this.http.get(`${API_ESTADOS_DET_ACTA}${idEstado}`).pipe(
      map((resp: any) => {
        return resp.result;
      })
    );
  }

  eliminarEstadosDetActa(idEstado: number): Observable<any> {
    return this.http.delete<any>(`${API_ESTADOS_DET_ACTA}/${idEstado}`);
  }

}
