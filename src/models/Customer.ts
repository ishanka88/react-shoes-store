import { CartItem } from "./CartItem";

export interface Customer {
    _id?: string;
    name?:string;
    address?: string;
    city?:string;
    tel1?: string;
    tel2?: string;
    cart?: CartItem[];
  }