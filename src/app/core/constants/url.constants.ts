// const ENVIROMENT: string = 'DEV';
const ENVIROMENT: string = 'PROD';

// let PATH_CORREO  = 'https://localhost:44395/';
let PATH_VISOR_DYNAMO = '';
let PATH_BACK_NET  = '';
let AUTH_API = '';
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
export const API_VISOR =  PATH_VISOR_DYNAMO + 'api/visor/';
// export const API_VISOR =  'https://localhost:7197/api/visor/';
export const API_CORREO = 'https://localhost:44395/api/email'; //NO SE USA EN DYNAMOSUPPORT



// PATH_BACK_NET  = 'http://backsupport.indratools.com/api/configurador/';
