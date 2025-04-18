import {Timestamp} from "firebase/firestore";

export interface Order {
    orderId?: number;
    tracking?: string;
    amount?: number;
    deliverCharges?: number;
    createdAt?: Timestamp|undefined;
    orderItems?: OrderItem[];
    status?: string;
    itemCount?: number;
    createdUserId?: string;
    name?: string;
    address?: string;
    contact1?: string;
    contact2?: string;
    city? : string;
    paymentMethod?: string;
}
export interface OrderItem {
    id?: number;
    productId?:string;
    itemCode?: string;
    mainImage?: string;
    title?:string;
    price?: number;
    discount?: number;
    quantity?: number,
    sizes?: { [size: number]: number }; 
    // Other properties of an order item
}

export interface Notification {
    createdAt?: Date,
    description?: string,
    targetUserId?: string,
    targetUserRef?: string,
    isRead?: boolean,
    title?: string,
    type?: string
}

