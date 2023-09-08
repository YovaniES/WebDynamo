// const ENVIROMENT: string = 'DEV';
const ENVIROMENT: string = 'PROD';

// let PATH_CORREO  = 'https://localhost:44395/';
let PATH_VISOR_DYNAMO = '';
let PATH_BACK_NET  = '';
let AUTH_API = '';
let API_SAVE_DATA_IMPORT = '';

switch (ENVIROMENT) {
  case 'DEV':
    // PATH_BACK_NET  = 'https://localhost:3061/api/configurador/';
    break;
  case 'QA':
    AUTH_API = '';
    break;
  case 'PROD':
    AUTH_API      = 'http://seguridadweb.indratools.com/aut/seguridad/';

    PATH_VISOR_DYNAMO  = 'http://visordynamosupportapi.indratools.com/';
    // PATH_VISOR_DYNAMO  = 'https://localhost:7197/';

    // API_SAVE_DATA_IMPORT = 'http://saveimporteddata.indratools.com/api/ScoreDetalle'
    API_SAVE_DATA_IMPORT = 'https://localhost:7247/api/ScoreDetalle'

    PATH_BACK_NET = 'http://backdynamosupport.indratools.com/api/configurador/'
    // PATH_BACK_NET  = 'https://localhost:3061/api/configurador/';
    break;
  default:
    break;
}

// LOGIN
export const AUTH_SESSION = AUTH_API + 'login';

// REGISTRO-DYNAMO
export const API_DYNAMO = PATH_BACK_NET + 'ExecuteQuery';
// DATA VISOR DASHBOARD
export const API_VISOR =  PATH_VISOR_DYNAMO + 'api/visor/';
// export const API_VISOR =  'https://localhost:7197/api/visor/';

// API GUARDAR DATA IMPORTADO DESDE EXCELL
export const PATH_IMPORT_LIQ = API_SAVE_DATA_IMPORT;

export const API_CORREO = 'https://localhost:44395/api/email'; //NO SE USA EN DYNAMOSUPPORT



// PATH_BACK_NET  = 'http://backsupport.indratools.com/api/configurador/';
