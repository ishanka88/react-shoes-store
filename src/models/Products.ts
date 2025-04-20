import { float } from "aws-sdk/clients/cloudfront";

    export interface Product {
        id?: string;
        genaratedCode?: string;
        itemCode?: string;
        name?:string;
        mainImages?: any;
        galleryImages?: any;
        videos?: any;
        category?: string;
        subCategory?: string;
        description?: string;
        price?: number;
        discount?: number; // Change float to number
        rating?: number;
        stock?: number;
        sizes?: { [size: number]: number }; // Store sizes with their stock
        productDetails?: { [specification: string]: string };
        displayOrder?: number;
    }


export interface Media {
    src?: string;
    type?: string;
}









  

  