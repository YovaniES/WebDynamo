export interface LiquidacionModel {
  idFactura         : number ;
  id_Liquidacion    : string;
  periodo?          : Date;
  idProyecto        : number;
  proyecto          : string;
  idTipoLiquidacion : number;
  tipoLiquidacion   : string;
  subServicio       : string;
  idGestor          : number;
  gestor            : string;
  lider             : string;
  estado            : string;
  ordenCompra       : string;
  codCertificacion  : string;
  factura           : string;
  importe           : any;
  declarado         : any;
  facturado         : any;
  pendiente         : any;
}

export interface RequestLiquidacion {
  periodo        : Date;
  idProyecto     : number;
  idLiquidacion  : number;
  subServicio    : string;
  idGestor       : number;
  venta_declarada: string;
  idEstado       : number;
  idUsuarioCrea  : number;
  fechaCrea      : Date;
  ver_estado     : number;
  id_reg_proy    : number;
}

export interface FiltroLiqModel {
  idFactura        : string;
  gestorNombre     : string;
  proyecto         : string;
  tipoLiquidacion  : string;
  estadoLiquidacion: string;
  importe          : string;
  periodo          : string;

  periodoActual    : string;
}

export interface picklist {
  id?: number;
  code?: string;
  name: string;
  filter?: string;
}

export interface UserDTO {
  id: number;
  username: string;
  displayname: string;
  subtitle: string;
  gender: string;
  bu: string;
  idssff: string;
  enable: boolean;
  location: string;
}


export interface UsuarioDTO {
  id     : number;
  name   : string;
  email  : string;
  country: string[];
  gender : string[];
  cargo  : string;
  rol    : string;
  company: string[];
}


export interface FiltroGestorModel {
  idGestor   : string;
  proyecto   : string;
  subservicio: string;
  estado     : string;
}
