import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  API_CERTIFICACION,
  API_CERTIFICACION_FILTRO,
  API_CLIENTE,
  API_CLIENTE_FILTRO,
  API_DET_CERTIFICACION,
  API_ESTADOS_DET_ACTA,
  API_ESTADO_ACTA,
  API_ESTADO_FACTURAS,
  API_FACTURAS,
  API_FACTURAS_FILTRO,
  API_GESTOR,
  API_GESTOR_COMBO,
  API_GESTOR_FILTRO,
  API_GESTOR_SUBS,
  API_JEFATURA,
  API_JEFATURA_FILTRO,
  API_LIDER,
  API_LIDER_FILTRO,
  API_ORDEN_COMPRA,
  API_ORDEN_COMPRA_COMBO,
  API_ORDEN_COMPRA_FILTRO,
  API_PROYECTO,
  API_PROYECTO_FILTRO,
  API_SUBSERVICIO,
  API_SUBSERVICIO_PROY,
  API_SUBSERV_COMBO,
  API_SUBSERV_FILTRO,
  PATH_IMPORT_LIQ,
} from '../constants/url.constants';

import { LiquidacionModel } from '../models/liquidacion.models';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LiquidacionService {

  constructor(private http: HttpClient) {}

  importarActas(listImport: LiquidacionModel[]) {
    return this.http.post(PATH_IMPORT_LIQ + '/guardar', listImport);
  }

  // SERVICES GESTOR
  getAllGestorFiltro(listGestor: any) {
    return this.http.post(API_GESTOR_FILTRO, listGestor).pipe(
      map((resp: any) => {
        return resp.result;
      })
    );
  }

  getAllGestorCombo() {
    return this.http.get(API_GESTOR_COMBO).pipe(
      map((g: any) => {
        return g.result;
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
    return this.http.get(`${API_GESTOR}/${idGestor}`).pipe(
      map((resp: any) => {
        // console.log('DATAGESTOR_BY_ID', resp.result);

        return resp.result;
      })
    );
  }

  eliminarGestor(idGestor: number): Observable<any> {
    return this.http.delete<any>(`${API_GESTOR}/${idGestor}`);
  }

  desasignarSubservicio(id: number): Observable<any> {
    return this.http.delete<any>(`${API_GESTOR_SUBS}/${id}`);
  }

  // SERVICES LIDER
  getAllLiderFilter(params: any) {
    return this.http.post(API_LIDER_FILTRO, params).pipe(
      map((resp: any) => {
        return resp.result;
      })
    );
  }

  getAllLiderCombo() {
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
  getAllProyectosFiltro(request: any): Observable<any> {
    return this.http.post<any>(API_PROYECTO_FILTRO, request).pipe(
      map((resp: any) => {
        return resp.result;
      })
    );
  }

  getAllProyectosCombo() {
    return this.http.get(API_PROYECTO).pipe(
      map((resp: any) => {
        return resp.result.filter((x:any) => x.estado.estadoId == 1);
      })
    );
  }

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
  getAllJefaturaFiltro(request: any) {
    return this.http.post(API_JEFATURA_FILTRO, request).pipe(
      map((resp: any) => {
        return resp.result;
      })
    );
  }

  getAllJefaturaCombo() {
    return this.http.get(API_JEFATURA).pipe(
      map((resp: any) => {
        return resp.result;
      })
    );
  }

  crearJefatura(requestJefatura: any): Observable<any> {
    return this.http.post(API_JEFATURA, requestJefatura);
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
  getAllClientesFiltro(request: any){
    return this.http.post<any>(API_CLIENTE_FILTRO, request).pipe(
      map( resp => {
        return resp.result;
      })
    )
  };

  getAllClientesCombo() {
    return this.http.get(API_CLIENTE).pipe(
      map((resp: any) => {
        return resp.result;
      })
    );
  };

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

  //  SERVICES - FACTURA
  getListaEstadosFactura() {
    return this.http.get(API_ESTADO_FACTURAS).pipe(
      map((resp: any) => {
        return resp.result;
      })
    );
  };

  getAllFacturasFiltro(params: any) {
    return this.http.post(API_FACTURAS_FILTRO, params).pipe(
      map((resp: any) => {
        return resp.result;
      })
    );
  };

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
  getAllEstadosActa() {
    return this.http.get(API_ESTADO_ACTA).pipe(
      map((resp: any) => {
        return resp.result;
      })
    );
  }

  eliminarEstadoActa(idEstado: number): Observable<any> {
    return this.http.delete<any>(`${API_ESTADO_ACTA}/${idEstado}`);
  }

  getAllEstadoDetalleActa(): Observable<any> {
    return this.http.get<any>(API_ESTADOS_DET_ACTA).pipe(
      map( resp => {
        return resp.result;
      })
    );
  }

  crearEstado(requestCert: any): Observable<any> {
    return this.http.post(API_ESTADO_ACTA, requestCert);
  }

  actualizarEstadoActa(idEstado: number, request: any) {
    return this.http.put<any>(`${API_ESTADO_ACTA}/${idEstado}`, request);
  }

  // actualizarEstado(idEstado: number, request: any) {
  //   return this.http.put<any>(`${API_ESTADOS_DET_ACTA}/${idEstado}`, request);
  // }

  getEstadoActaById(idEstado: number): Observable<any> {
    return this.http.get(`${API_ESTADO_ACTA}/${idEstado}`).pipe(
      map((resp: any) => {
        return resp.result;
      })
    );
  }

  // eliminarEstado(idEstado: number): Observable<any> {
  //   return this.http.delete<any>(`${API_ESTADOS_DET_ACTA}/${idEstado}`);
  // }


  //  SERVICES - CERTIFICACIONES
  getAllCertificacionesFiltro(request: any): Observable<any> {
    return this.http.post<any>(API_CERTIFICACION_FILTRO, request).pipe(
      map((resp: any) => {
        return resp.result;
      })
    );
  }

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

  eliminarDetalleCertificacion(idCert: number): Observable<any> {
    return this.http.delete<any>(`${API_DET_CERTIFICACION}/${idCert}`);
  }

  // SERVICES - SUBSERVICIOS
  getAllSubservicios() {
    return this.http.get(API_SUBSERVICIO);
  }

  getAllSubserviciosCombo() {
    return this.http.get(API_SUBSERV_COMBO).pipe(
      map((resp: any) => {
        return resp.result.filter((x:any) => x.isActive == 1)
      })
    );
  }

  getAllSubserviciosFiltroByProy(params: any) {
    return this.http.post(API_SUBSERVICIO_PROY, params).pipe(
      map((resp: any) => {
        // console.log('*>>', resp.result);
        return resp.result
      })
    );
  }

  getAllSubserviciosFiltro(requestSub: any) {
    return this.http.post(API_SUBSERV_FILTRO, requestSub).pipe(
      map( (resp: any) => {
        return resp.result;
      })
    );
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

  // SERVICES ORDEN COMPRA
  getAllOrdenCompraFiltro(listOrdenCompra: any) {
    return this.http.post(API_ORDEN_COMPRA_FILTRO, listOrdenCompra).pipe(
      map((resp: any) => {
        console.log('SERV-OC-FILTRO', resp);
        return resp.result;
      })
    );
  }

  getAllOrdenCombo() {
    return this.http.get(API_ORDEN_COMPRA_COMBO).pipe(
      map((oc: any) => {
        return oc.result;
      })
    );
  }

  getAllOrdenCompra() {
    return this.http.get(API_ORDEN_COMPRA).pipe(
      map((oc: any) => {
        return oc.result;
      })
    );
  }

  crearOrdenCompra(requestOrden: any): Observable<any> {
    return this.http.post(API_ORDEN_COMPRA, requestOrden);
  }

  actualizarOrdenCompra(idOrden: number, requestCert: any) {
    return this.http.put<any>(
      `${API_ORDEN_COMPRA}/${idOrden}`,
      requestCert
    );
  }

  getOrdenCompraById(idOrden: number): Observable<any> {
    return this.http.get(`${API_ORDEN_COMPRA}/${idOrden}`).pipe(
      map((resp: any) => {
        console.log('DATA_OC_BY_ID', resp.result);
        return resp.result;
      })
    );
  }

  eliminarOrdenCompra(idOrden: number): Observable<any> {
    return this.http.delete<any>(`${API_ORDEN_COMPRA}/${idOrden}`);
  };

}
