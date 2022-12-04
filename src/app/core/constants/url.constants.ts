// const ENVIROMENT: string = 'DEV';
const ENVIROMENT: string = 'PROD';

// let PATH_CORREO  = 'https://localhost:44395/';
let PATH_BACK_NET  = '';
let AUTH_B2B = '';
switch (ENVIROMENT) {
  case 'DEV':
    // PATH_BACK_NET  = 'https://localhost:3061/api/configurador/';
    // AUTH_B2B       = 'http://b2bsecurityservice.indratools.com/aut/seguridad/';
    break;
  case 'QA':
    AUTH_B2B = '';
    break;
  case 'PROD':
     PATH_BACK_NET  = 'https://localhost:3061/api/configurador/';

    // PATH_BACK_NET = 'http://backdynamosupport.indratools.com/api/configurador/'
    AUTH_B2B      = 'http://b2bsecurityservice.indratools.com/aut/seguridad/';
    break;
  default:
    break;
}

export const AUTH_SESSION_B2B = AUTH_B2B + '/login';

// REGISTRO
export const API_DYNAMO = PATH_BACK_NET + 'ExecuteQuery';
export const API_CORREO = 'https://localhost:44395/api/email';

// PATH_BACK_NET  = 'http://backsupport.indratools.com/api/configurador/';
