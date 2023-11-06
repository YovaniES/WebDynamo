export interface LiquidacionModel{
  IdFactura      : number;
  IdProyecto     : number;
  IdLiquidacion  : number;
  SubServicio    : string;
  IdGestor       : number;
  Venta_declarada: string;
  IdEstado       : number;
  Periodo        : Date;
  Id_reg_proy    : number;
  FechaCrea      : Date
};

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
