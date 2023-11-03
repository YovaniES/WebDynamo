import { HttpClient } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import {
  API_GESTOR,
  API_JEFATURA,
  API_LIDER,
  API_PROYECTO,
  API_SUBSERVICIO,
  PATH_IMPORT_LIQ,
} from '../constants/url.constants';
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
      map((resp: any) => {
        return resp.result;
      })
    );
  }

  crearGestor(requestGestor: any): Observable<any> {
    return this.http.post(API_GESTOR, requestGestor);
  }

  // OJO FALTA
  actualizarGestor(idGestor: number, requestCert: any) {
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

  eliminarGestor(idGestor: number): Observable<any> {
    return this.http.delete<any>(`${API_GESTOR}/${idGestor}`);
  }

  // SERVICES LIDER
  getAllLideres() {
    return this.http.get(API_LIDER).pipe(
      map((resp: any) => {
        return resp.result;
      })
    );
  }

  crearLider(requestLider: any): Observable<any> {
    return this.http.post(API_LIDER, requestLider);
  }

  getLiderById(idLider: number): Observable<any> {
    return this.http.get(`${API_LIDER}/${idLider}`).pipe(
      map((resp: any) => {
        console.log('DATALIDER_BY_ID', resp.result);

        return resp.result;
      })
    );
  }

  actualizarLider(idLider: number, request: any) {
    return this.http.put<any>(`${API_LIDER}/${idLider}`, request);
  }

  eliminarLider(idLider: number): Observable<any> {
    return this.http.delete<any>(`${API_LIDER}/${idLider}`);
  }

  //  SERVICES - PROYECTO
  crearProyecto(requestProy: any): Observable<any> {
    return this.http.post(API_PROYECTO, requestProy);
  }

  actualizarProyecto(idProy: number, request: any) {
    return this.http.put<any>(`${API_PROYECTO}/${idProy}`, request);
  }

  getProyectoById(idLider: number): Observable<any> {
    return this.http.get(`${API_PROYECTO}/${idLider}`).pipe(
      map((resp: any) => {
        console.log('DATALPROY_BY_ID', resp.result);

        return resp.result;
      })
    );
  }

  eliminarProyecto(idProy: number): Observable<any> {
    return this.http.delete<any>(`${API_PROYECTO}/${idProy}`);
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

  eliminarSubservicio(idSub: number): Observable<any> {
    return this.http.delete<any>(`${API_SUBSERVICIO}/${idSub}`);
  }

  actualizarSubservicio(idSub: number, request: any) {
    return this.http.put<any>(`${API_SUBSERVICIO}/${idSub}`, request);
  }

  crearSubservicio(requestSubs: any): Observable<any> {
    return this.http.post<any>(API_SUBSERVICIO, requestSubs);
  }

  // SERVICES - JEFATURAS
  getAllJefaturas() {
    return this.http.get(API_JEFATURA).pipe(
      map((resp: any) => {
        return resp.result;
      })
    );
  }

  // MANTENIMIENTO
  getAllProyectos() {
    return this.http.get(API_PROYECTO).pipe(
      map((resp: any) => {
        return resp.result;
      })
    );
  }

  getAllSubservicio() {
    return this.http.get(API_SUBSERVICIO).pipe(
      map((resp: any) => {
        return resp.result;
      })
    );
  }
}
