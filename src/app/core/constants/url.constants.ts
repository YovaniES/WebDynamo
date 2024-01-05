// const ENVIROMENT: string = 'DEV';
const ENVIROMENT: string = 'PROD';

let PATH_VISOR_DYNAMO = '';
let PATH_BACK_NET     = '';
let AUTH_API          = '';
let BASE_LIQUIDACION  = ''
let MANTENIM_LIQUIDACION = '';
let API_SAVE_DATA_IMPORT = '';

switch (ENVIROMENT) {
  case 'DEV':
    break;
  case 'QA':
    AUTH_API = '';
    break;
  case 'PROD':
    AUTH_API      = 'http://seguridadweb.indratools.com/aut/seguridad/';
    // AUTH_API = 'https://seguridadweb.azurewebsites.net/api/auth/'

    PATH_VISOR_DYNAMO  = 'http://visordynamosupportapi.indratools.com/';


    API_SAVE_DATA_IMPORT = 'http://saveimporteddata.indratools.com/api/importar' // CONECTADO con: db_support
    // API_SAVE_DATA_IMPORT = 'http://backendpruebasdev.indratools.com/api/importar'

    BASE_LIQUIDACION = 'https://facturaciondynamo2.azurewebsites.net/api/'
    // BASE_LIQUIDACION = 'http://facturaciondynamoprueba.indratools.com/api/'

    MANTENIM_LIQUIDACION = 'https://mantenimientodynamo.azurewebsites.net/api/'

    PATH_BACK_NET = 'http://backdynamosupport.indratools.com/api/configurador/' //SUBSITE 21
    break;
  default:
    break;
}


// LOGIN
export const AUTH_SESSION = AUTH_API + 'login';

// REGISTRO-DYNAMO
export const API_DYNAMO = PATH_BACK_NET + 'ExecuteQuery';
export const API_GESTOR              = BASE_LIQUIDACION + 'Gestor';
export const API_GESTOR_FILTRO       = BASE_LIQUIDACION + 'Gestor/getAllGestores';
export const API_GESTOR_COMBO        = BASE_LIQUIDACION + 'Gestor/GestorListado';
export const API_GESTOR_SUBS         = BASE_LIQUIDACION + 'GestorSubservicio';
export const API_SUBSERV_COMBO       = BASE_LIQUIDACION + 'Subservicio/SubservicioListado';
export const API_SUBSERV_FILTRO      = BASE_LIQUIDACION + 'Subservicio/GetAllSubservicio';
export const API_SUBSERVICIO         = BASE_LIQUIDACION + 'Subservicio';
export const API_SUBSERVICIO_COMBO   = BASE_LIQUIDACION + 'Subservicio/SubservicioListado';
export const API_ACTAS               = BASE_LIQUIDACION + 'acta/';
export const API_ACTAS_FILTRO        = BASE_LIQUIDACION + 'acta/GetAllActas';
export const API_ORDEN_COMPRA        = BASE_LIQUIDACION + 'OrdenCompra';
export const API_ORDEN_COMPRA_COMBO  = BASE_LIQUIDACION + 'OrdenCompra/ordencompralistado';
export const API_ORDEN_COMPRA_FILTRO = BASE_LIQUIDACION + 'OrdenCompra/GetAllOrdenCompra';
export const API_ESTADO_ACTA         = BASE_LIQUIDACION + 'EstadoActa';
export const API_DET_ACTA            = BASE_LIQUIDACION + 'detalleActa';
export const API_ESTADOS_DET_ACTA    = BASE_LIQUIDACION + 'EstadoDetalleActa';
export const API_VENTA_DECLARADA     = BASE_LIQUIDACION + 'Declarado';
export const API_CERTIFICACION       = BASE_LIQUIDACION + 'Certificacion';
export const API_DET_CERTIFICACION   = BASE_LIQUIDACION + 'DetalleActaCertificacion';
export const API_FACTURAS_FILTRO     = BASE_LIQUIDACION + 'Factura/filtrar';
export const API_FACTURAS            = BASE_LIQUIDACION + 'Factura';
export const API_ESTADO_FACTURAS     = BASE_LIQUIDACION + 'Factura/EstadoFactura';
export const API_IMPORT_ACTAS        = BASE_LIQUIDACION + 'Acta/ImportActaExcel';
// https://facturaciondynamo2.azurewebsites.net/api/Factura/filtrar


// MANTENIMIENTO LIQUIDACION
export const API_PROYECTO = MANTENIM_LIQUIDACION + 'Proyecto'
export const API_LIDER    = MANTENIM_LIQUIDACION + 'Lider';
export const API_JEFATURA = MANTENIM_LIQUIDACION + 'Jefatura';
export const API_CLIENTE  = MANTENIM_LIQUIDACION + 'Cliente';
// export const API_ESTADOS  = MANTENIM_LIQUIDACION + 'Estado';


// DATA VISOR DASHBOARD
export const API_VISOR =  PATH_VISOR_DYNAMO + 'api/visor/';

// API GUARDAR DATA IMPORTADO DESDE EXCELL
export const PATH_IMPORT_LIQ = API_SAVE_DATA_IMPORT;

export const API_CORREO = 'https://localhost:44395/api/email'; //NO SE USA EN DYNAMOSUPPORT







// https://localhost:7247/api/Facturacion/Guardar
// http://localhost:5167/swagger/v1/swagger.json // LOGIN SEGURIDAD WEB

// PATH_BACK_NET  = 'http://backsupport.indratools.com/api/configurador/';


// NOTA: SUBSITE 28 => http://saveimporteddata.indratools.com
// NOTA: SUBSITE 33 => 'http://backendpruebasdev.indratools.com' | BACKEN SOLO PRUEBAS EN DEV
// changestatevacations.indratools.com : NOTA => SE ESTA USANDO PARA PRUEBAS DE DEV. Ya luego regresar con su API de cambiar estado de las vacaciones. 13/09/2023


// PATH_BACK_NET = 'http://changestatevacations.indratools.com/api/configurador/' //BACK DE PRUEBA OJO | SUBSITE 25
