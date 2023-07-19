// const ENVIROMENT: string = 'DEV';
const ENVIROMENT: string = 'PROD';

// let PATH_CORREO  = 'https://localhost:44395/';
let PATH_BACK_NET  = '';
let AUTH_API = '';
switch (ENVIROMENT) {
  case 'DEV':
    // PATH_BACK_NET  = 'https://localhost:3061/api/configurador/';
    // AUTH_B2B       = 'http://b2bsecurityservice.indratools.com/aut/seguridad/';
    break;
  case 'QA':
    AUTH_API = '';
    break;
  case 'PROD':
    // AUTH_B2B      = 'http://b2bsecurityservice.indratools.com/aut/seguridad/';
    AUTH_API      = 'http://seguridadweb.indratools.com/aut/seguridad/';

    //  PATH_BACK_NET  = 'https://localhost:3061/api/configurador/';
     PATH_BACK_NET = 'http://backdynamosupport.indratools.com/api/configurador/'

    break;
  default:
    break;
}

// LOGIN
export const AUTH_SESSION = AUTH_API + 'login';

// REGISTRO-DYNAMO
export const API_DYNAMO = PATH_BACK_NET + 'ExecuteQuery';
export const API_CORREO = 'https://localhost:44395/api/email';

// PATH_BACK_NET  = 'http://backsupport.indratools.com/api/configurador/';
