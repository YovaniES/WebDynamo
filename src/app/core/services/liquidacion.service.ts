import { HttpClient } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import {
  API_CERTIFICACION,
  API_CLIENTE,
  API_ESTADOS,
  API_FACTURAS,
  API_GESTOR,
  API_GESTOR_FILTRO,
  API_JEFATURA,
  API_LIDER,
  API_PROYECTO,
  API_SUBSERVICIO,
  API_SUBSERV_FILTRO,
  PATH_IMPORT_LIQ,
} from '../constants/url.constants';
import {
  FiltroGestorModel,
  LiquidacionModel,
} from '../models/liquidacion.models';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LiquidacionService {
  toggleUserPanel = new EventEmitter<boolean>();
  // currentUser: any;

  constructor(private http: HttpClient) {}

  insertarListadoLiquidacion(listImport: LiquidacionModel[]) {
    return this.http.post(PATH_IMPORT_LIQ + '/guardar', listImport);
  }

  // SERVICES GESTOR
  getAllGestor(listGestor: any) {
    return this.http.post(API_GESTOR_FILTRO, listGestor).pipe(
      map((resp: any) => {
        console.log('SERV-GESTOR', resp);

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

  //  SERVICES - JEFATURA
  getAllJefatura() {
    return this.http.get(API_JEFATURA).pipe(
      map((resp: any) => {
        return resp.result;
      })
    );
  }
  crearJefatura(requestProy: any): Observable<any> {
    return this.http.post(API_JEFATURA, requestProy);
  }

  actualizarJefatura(idJefatura: number, request: any) {
    return this.http.put<any>(`${API_JEFATURA}/${idJefatura}`, request);
  }

  getJefaturaById(idJefatura: number): Observable<any> {
    return this.http.get(`${API_JEFATURA}/${idJefatura}`).pipe(
      map((resp: any) => {
        console.log('DATA_JEFA_BY_ID', resp.result);

        return resp.result;
      })
    );
  }

  eliminarJefatura(idJefatura: number): Observable<any> {
    return this.http.delete<any>(`${API_JEFATURA}/${idJefatura}`);
  }

  //  SERVICES - CLIENTE
  getAllClientes() {
    return this.http.get(API_CLIENTE).pipe(
      map((resp: any) => {
        return resp.result;
      })
    );
  }
  crearCliente(requestProy: any): Observable<any> {
    return this.http.post(API_CLIENTE, requestProy);
  }

  actualizarCliente(idCliente: number, request: any) {
    return this.http.put<any>(`${API_CLIENTE}/${idCliente}`, request);
  }

  getClienteById(idCliente: number): Observable<any> {
    return this.http.get(`${API_CLIENTE}/${idCliente}`).pipe(
      map((resp: any) => {
        console.log('DATA_CLIENTE_BY_ID', resp.result);

        return resp.result;
      })
    );
  }

  eliminarCliente(idCliente: number): Observable<any> {
    return this.http.delete<any>(`${API_CLIENTE}/${idCliente}`);
  }

  //  SERVICES - Facturas
  getAllFacturas() {
    return this.http.get(API_FACTURAS).pipe(
      map((resp: any) => {
        return resp.result;
      })
    );
  }
  crearFactura(requestFactura: any): Observable<any> {
    return this.http.post(API_FACTURAS, requestFactura);
  }

  actualizarFactura(idFactura: number, request: any) {
    return this.http.put<any>(`${API_FACTURAS}/${idFactura}`, request);
  }

  getFacturaById(idFactura: number): Observable<any> {
    return this.http.get(`${API_FACTURAS}/${idFactura}`).pipe(
      map((resp: any) => {
        console.log('DATA_FACTURAS_BY_ID', resp.result);

        return resp.result;
      })
    );
  }

  eliminarFacturas(idFacturas: number): Observable<any> {
    return this.http.delete<any>(`${API_FACTURAS}/${idFacturas}`);
  }

  //  SERVICES - ESTADOS
  getAllEstados() {
    return this.http.get(API_ESTADOS).pipe(
      map((resp: any) => {
        return resp.result;
      })
    );
  }
  crearEstado(requestCert: any): Observable<any> {
    return this.http.post(API_ESTADOS, requestCert);
  }

  actualizarEstado(idEstado: number, request: any) {
    return this.http.put<any>(`${API_ESTADOS}/${idEstado}`, request);
  }

  getEstadoById(idEstado: number): Observable<any> {
    return this.http.get(`${API_ESTADOS}/${idEstado}`).pipe(
      map((resp: any) => {
        return resp.result;
      })
    );
  }

  eliminarEstado(idEstado: number): Observable<any> {
    return this.http.delete<any>(`${API_ESTADOS}/${idEstado}`);
  }

  //  SERVICES - CERTIFICACIONES
  getAllCertificaciones() {
    return this.http.get(API_CERTIFICACION).pipe(
      map((resp: any) => {
        return resp.result;
      })
    );
  }
  crearCertificacion(requestCert: any): Observable<any> {
    return this.http.post(API_CERTIFICACION, requestCert);
  }

  actualizarCertificacion(idCert: number, request: any) {
    return this.http.put<any>(`${API_CERTIFICACION}/${idCert}`, request);
  }

  getCertificacionById(idCert: number): Observable<any> {
    return this.http.get(`${API_CERTIFICACION}/${idCert}`).pipe(
      map((resp: any) => {
        return resp.result;
      })
    );
  }

  eliminarCertificacion(idCert: number): Observable<any> {
    return this.http.delete<any>(`${API_CERTIFICACION}/${idCert}`);
  }

  // SERVICES - SUBSERVICIOS
  getAllSubservicios(requestSub: any) {
    return this.http.post(API_SUBSERV_FILTRO, requestSub);
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

  // getAllSubservicio() {
  //   return this.http.get(API_SUBSERVICIO).pipe(
  //     map((resp: any) => {
  //       return resp.result;
  //     })
  //   );
  // }
}
