import { float } from "aws-sdk/clients/cloudfront";

export interface CartItem {
    id?: string;
    genaratedCode?: string;
    itemCode?: string;
    sizes?: { [size: number]: number }; // Store sizes with their stock
    quantity?: number
}














  

  