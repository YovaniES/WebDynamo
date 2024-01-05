// import { ROLES_ENUM } from "../constants/rol.constants";

export interface Menu {
  code: string;
  text: string;
  order: number;
  icon: string;
  type: string;
  link: string;
  enable: boolean;
  module: string;
  displayed?: boolean;
  // roles?: ROLES_ENUM[];
  submenus: Menu[];
}

export interface Detalle {
  nombre       : string;
  unidades     : string;
  precio_unidad: string;
  precioTotal  : string;
  perfil       : string;
  observacion  : string;
  unidad       : string;
  comentario   : string;
  categoria1   : string;
  categoria2   : string;
}



// {
//   "success": true,
//   "message": "Lista de Actas",
//   "result": [
//       {
//           "idGestor": 687,
//           "gestor": "Santiago",
//           "periodo": "2024-01",
//           "estado": null,
//           "ventaTotal": 0.00,
//           "facturadoTotal": 0.00,
//           "declaradoTotal": 0.00,
//           "pendiente": 0,
//           "comentario": "Cantidad 1",
//           "actaResponses": [
//               {
//                   "idActa": 200,
//                   "idGestor": 687,
//                   "gestor": "Santiago",
//                   "idProyecto": 97,
//                   "proyecto": "PMOGTI",
//                   "idSubservicio": 4,
//                   "subservicio": "Servicio de PMO Gobierno TI",
//                   "periodo": "2024-01-01T00:00:00",
//                   "ventaTotalActa": 0.00,
//                   "facturadoTotalActa": 0.00,
//                   "declaradoTotalActa": 0.00,
//                   "pendiente": 0.0,
//                   "comentario": "",
//                   "idEstado": 1,
//                   "estado": "Completado",
//                   "enlaceActa": ""
//               }
//           ]
//       }
//     ]
//   }
