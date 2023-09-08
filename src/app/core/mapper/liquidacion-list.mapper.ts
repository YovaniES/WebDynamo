import { LiquidacionModel } from '../models/liquidacion.models';

export function mapearImportLiquidacion(data: any[],): LiquidacionModel[] {
  const listaLiquid: LiquidacionModel[] = data.map((liq) => {
    const liquidacionModel: LiquidacionModel = {
      IdFactura      : liq.id,
      IdProyecto     : liq.IdProyecto,
      IdLiquidacion  : liq.IdLiquidacion,
      SubServicio    : liq.Subservicio,
      IdGestor       : liq.IdGestor,
      Venta_declarada: liq.Importe,
      Periodo        : new Date(liq.Periodo),

      // IdFactura      : liq.id,
      // Proyecto       : liq.Proyecto,
      // Subservicio    : liq.Subservicio,
      // Gestor         : liq.Gestor,
      // Venta_declarada: liq.Importe,
      // Periodo        : new Date(liq.Periodo),

      // idscore           : idScore,
      // fecha_proceso     : new Date(detalle.FECHAPROCESO), //masivo: 20230412, Individual: 08/02/2023
      // observacion_gestor: '',
      // id_estado         : 1,  // default = 1: Solicitado
      // item_version      : version + 1,
    };
    return liquidacionModel;
  });
  return listaLiquid;
}


// export function mapearImportScore(scoreData: any[], version?: number): LiquidacionModel[] {
//   const listadoDetalle: LiquidacionModel[] = scoreData.map((detalle) => {
//     const liquidacionModel: LiquidacionModel = {
//       // idscore           : idScore,
//       tipo_documento    : detalle.TIPODOCUMENTO,
//       numero_documento  : detalle.NUMDOCUMENTO,
//       segmento          : detalle.Segmento,
//       q_lineas          : detalle.QLINEAS,
//       capacidad_fin     : detalle.CAPACIDADFINANCIAMIENTO,
//       codigo_fin        : detalle.CODFINANCIAMIENTO,
//       fecha_proceso     : new Date(detalle.FECHAPROCESO), //masivo: 20230412, Individual: 08/02/2023
//       score             : detalle.SCORE,
//       cargo_fijo_max    : detalle.CARGOFIJOMAXIMO,
//       observacion_solic : detalle.OBSERVACIONES,
//       observacion_gestor: '',
//       id_estado         : 1,  // default = 1: Solicitado
//       idrequerimiento   : detalle.REQ,
//       solicitante       : detalle.Analista,
//       financiamiento    : detalle.Financiamiento,
//       nombre_req        : detalle.NombreREQ,
//       // item_version      : version + 1,
//       negocio_segmento  : detalle.NEGOCIOYSEGMENTO ,
//       tipo_transaccion  : detalle.TIPOTRANSACCION ,
//       tipo_venta        : detalle.TIPODEVENTA ,
//       gama              : detalle.GAMADEEQUIPO,

//       cuota_inicial     : detalle.CUOTAINICIAL,
//       nombres           : detalle.NOMBRESYAPELLIDOSDELCLIENTE,
//       tipo_proyecto     : detalle.TIPODEPROYECTO,
//       nombre_proy       : detalle.NOMBREDEPROYECTO,
//     };
//     return liquidacionModel;
//   });
//   return listadoDetalle;
// }
