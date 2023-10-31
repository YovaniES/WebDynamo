import { HttpClient } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import { API_GESTOR, API_PROYECTO, API_SUBSERVICIO, PATH_IMPORT_LIQ } from '../constants/url.constants';
import { LiquidacionModel } from '../models/liquidacion.models';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LiquidacionService {
  toggleUserPanel = new EventEmitter<boolean>();
  currentUser: any;

  constructor(private http: HttpClient) {}

  insertarListadoLiquidacion(listImport: LiquidacionModel[]) {
    return this.http.post(PATH_IMPORT_LIQ + '/guardar', listImport);
  }

  // SERVICES GESTOR
  getAllGestor() {
    return this.http.get(API_GESTOR).pipe(
      map((resp:any) =>{
        return resp.result
      }));
  }

  crearGestor(requestGestor: any): Observable<any>{
    return this.http.post(API_GESTOR, requestGestor);
  }

  // OJO FALTA
  actualizarGestor(idGestor: number, requestCert: any){
    return this.http.put<any>(`${API_GESTOR}/${idGestor}`, requestCert);
  }

  getGestorById(idGestor: number): Observable<any> {
    //liqById
    return this.http.get(`${API_GESTOR}/${idGestor}`).pipe(
      map((resp: any) => {
        console.log('DATAGESTOR_BY_ID', resp.result);

        return resp.result;
      })
    );
  }

  // SERVICES - SUBSERVICIOS
  getAllSubservicios() {
    return this.http.get(API_SUBSERVICIO);
  }

  getSubserviciosById(idSubserv: number): Observable<any> {
    return this.http.get(`${API_SUBSERVICIO}/${idSubserv}`).pipe(
      map((resp: any) => {
        console.log('DATASUBSERV_BY_ID', resp.result);

        return resp.result;
      })
    );
  }

  crearSubservicio(requestSubs: any): Observable<any>{
    return this.http.post(API_SUBSERVICIO, requestSubs);
  }

  // MANTENIMIENTO
  getAllProyecto(){
    return this.http.get(API_PROYECTO).pipe(
      map((resp:any) => {
        return resp.result;
      })
    );
  }


  getAllSubservicio(){
    return this.http.get(API_SUBSERVICIO).pipe(
      map((resp:any) => {
        return resp.result;
      })
    );
  }

}
