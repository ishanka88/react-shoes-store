import { float } from "aws-sdk/clients/cloudfront";

export interface CartItem {
    id?: any;
    title?: string;
    mainImage?: any;
    category?: string;
    itemCode?: string;
    price?: number;
    discount?: number; // Change float to number
    sizes?: { [size: number]: number }; // Store sizes with their stock
    quantity?: number
}











  

  