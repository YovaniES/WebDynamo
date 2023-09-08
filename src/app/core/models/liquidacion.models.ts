export interface LiquidacionModel{
  IdFactura      : number;
  IdProyecto     : number;
  IdLiquidacion  : number;
  SubServicio    : string;
  IdGestor       : number;
  Venta_declarada: string;
  Periodo        : Date;


  // IdFactura      : number;
  // Proyecto       : string;
  // Subservicio    : string;
  // Gestor         : string;
  // Venta_declarada: string;
  // Periodo        : Date;
};


// export interface LiquidacionModel_X{
//   // idscore                : number;
//   tipo_documento         : string;
//   numero_documento       : string;
//   segmento               : string;
//   q_lineas               : number;
//   capacidad_fin          : number;
//   codigo_fin             : number;
//   fecha_proceso          : Date;
//   score                  : number;
//   cargo_fijo_max         : number;
//   observacion_solic      : string;
//   observacion_gestor     : string;
//   id_estado              : number;
//   idrequerimiento        : string;
//   solicitante            : string;
//   financiamiento         : number,
//   nombre_req             : string,
//   // item_version           : number,
//   negocio_segmento       : string,
//   tipo_transaccion       : string,
//   tipo_venta             : string,
//   gama                   : string,
//   cuota_inicial          : string,
//   nombres                : string,
//   tipo_proyecto          : string,
//   nombre_proy            : string,
// }
