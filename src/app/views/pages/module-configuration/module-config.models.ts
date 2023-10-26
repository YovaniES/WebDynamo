import { picklist } from "src/app/core/models/liquidacion.models";

export interface permissionRequest {
  module: string;
  users: number[];
  menus: string[];
  // segments: string[];
  // functions: roleSelector[];
}
export interface useritem {
  id: number;
  value: string;
}
export interface roleSelector {
  code: string;
  lvl: string;
}

export interface moduleDetails{
  code:string,
  name:string,
  menus:picklist[]
  /* segments:picklist[],
  functions:picklist[], */
}

export interface prMenus {
  code: string;
  name: string;
  icon: string;
  selected: boolean;
}

export interface prFunc {
  code: string;
  name: string;
  lvl: string;
}
