import { ROLES_ENUM } from "../constants/rol.constants";

export const PERMISSION = {
  MENU_PERSONAS     : [ ROLES_ENUM.SUPER_ADMIN, ROLES_ENUM.ADMIN, ROLES_ENUM.CORD_TDP],
  MENU_MANTENIMIENTO: [ ROLES_ENUM.SUPER_ADMIN, ROLES_ENUM.ADMIN, ROLES_ENUM.GESTOR],
  MENU_FACTURACION  : [ ROLES_ENUM.SUPER_ADMIN, ROLES_ENUM.GESTOR ]
}


// 101	Usuario
// 100	Usuario Soporte
// 102	Coordinador Tdp
// 103	Usuario Externo
// 104	Admin
// 105	Super Admin
// 106	Gestor
