import { CartItem } from "./CartItem";

export interface UserInfo {
    id?: string;
    name?:string;
    address?: string;
    city?:string;
    tel1?: string;
    tel2?: string;
    cart?: CartItem[];
    orders?: Array<number>;
}

