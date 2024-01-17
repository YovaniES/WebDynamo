import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { BASE_CERTIFICACION, BASE_HIST_LIQ, BASE_FACTURACION, BASE_VENTADECLARADA, PATH_IMPORT_LIQ } from '../constants/url.constants';
import { RequestLiquidacion } from '../models/liquidacion.models';
import { SaveLiquidacionModel } from '../models/save-liquidacion.models';

@Injectable({
  providedIn: 'root',
})
export class FacturaService {

  constructor(private http: HttpClient,) {}

  insertarListadoLiquidacion(listImport: SaveLiquidacionModel[]): Observable<any> {
    return this.http.post(PATH_IMPORT_LIQ + '/guardar', listImport);
  }

  getAllLiquidaciones(listLiq: any){
    return this.http.post(BASE_FACTURACION + '/GetAllLiquidacion', listLiq);
  }

  getAllListaExportVD(){
    return this.http.get(BASE_FACTURACION + '/exportVentaDeclarada');
  }

  getLiquidacionById(idLiq: number): Observable<any>{ //liqById
    return this.http.get(`${BASE_FACTURACION}/GetLiquidacionById/${idLiq}`).pipe(
      map((resp: any) => {
        console.log('DATA_BY_ID', resp.result);

        return resp.result;
      })
    );
  }

  createLiquidacion(requestLiq: RequestLiquidacion[]): Observable<any>{
    return this.http.post(BASE_FACTURACION, requestLiq);
  }

  crearVentaDeclarada(requestVd: any): Observable<any>{
    return this.http.post(BASE_VENTADECLARADA, requestVd);
  }

  crearCertificacion(requestCert: any): Observable<any>{
    return this.http.post(BASE_CERTIFICACION, requestCert);
  }

  actualizarLiquidacion(idFact: number, requestLiq: any[]){
    return this.http.put<any>(`${BASE_FACTURACION}/${idFact}`, requestLiq)
  }

  actualizarVentaDeclarada(idVd: number, requestVd: any){
    return this.http.put<any>(`${BASE_VENTADECLARADA}/${idVd}`, requestVd);
  }

  actualizarCertificacion(idCert: number, requestCert: any){
    return this.http.put<any>(`${BASE_CERTIFICACION}/${idCert}`, requestCert);
  }


  deleteLiquidacion(idLiq: number): Observable<any>{
    return this.http.delete<any>(`${BASE_FACTURACION}/${idLiq}`)
  }

  eliminaVentaDeclarada(idVd: number): Observable<any>{
    return this.http.delete<any>(`${BASE_VENTADECLARADA}/${idVd}`)
  }

  eliminarCertificacion(idCert: number): Observable<any>{
    return this.http.delete<any>(`${BASE_CERTIFICACION}/${idCert}`)
  }

  // VENTA DECLARADA Y CERTIFICACIONES
  getAllVentaDeclarada(idLiq: any): Observable<any>{ //any <> IResponse: {message: , result: , }
    return this.http.post(`${BASE_VENTADECLARADA}/idFactura`, idLiq)
    // .pipe(
    //   map((resp: any) => {
    //     console.log('VD_SERV', resp);

    //   })
    // );
  }

  getVentaDeclaradaById(idVentaDecl: number){
    return this.http.get(`${BASE_VENTADECLARADA}/${idVentaDecl}`)
    .pipe(map((resp: any) => {
        console.log('DATA_BY_ID', resp.result);

          return resp.result;
      })
    );
  }

  getCertificacionById(idcert: number){
    return this.http.get(`${BASE_CERTIFICACION}/${idcert}`)
    .pipe(map((resp: any) => {
        console.log('DATA_BY_CERT', resp.result);

          return resp.result;
      })
    );
  }

  getListCertificacion(idCert: any){
    return this.http.post(`${BASE_CERTIFICACION}/idFactura`, idCert)
    // .pipe(
    //   map((resp: any) => {
    //     console.log('CERT_SERV', resp);
    //   })
    // );
  }

  // BASE_HIST_LIQ
  getHistLiquidacion(idLiq: number){
    return this.http.get(`${BASE_HIST_LIQ}/${idLiq}`)
  }
}

