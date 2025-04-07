import { float } from "aws-sdk/clients/cloudfront";

export interface CartItem {
    productId?: string;
    genaratedCode?: string;
    itemCode?: string;
    sizes?: { [size: number]: number }; // Store sizes with their stock
    quantity?: number
}

export interface ModifiedCartItem {
    id: number;
    productId:string;
    title: string;
    itemCode:string;
    mainImage: string;
    selectedSizes: { [key: number]: number };
    availableSizes: { [key: number]: number };
    quantity: number;
    price: number;
    discount:number;
    selected: boolean;
    stock:number;
  }












  

  