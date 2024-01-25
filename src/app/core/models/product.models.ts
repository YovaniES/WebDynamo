export interface ProductModel {
  id          : number,
  product     : string,
  category    : string,
  stock       : number,
  state       : number,
  price       : string,
  create_date : string,
  // antiquity   : number,
}

export interface FiltroProduct {
  idProduct : string;
  product   : string;
  category  : string;
  state     : string;
}
