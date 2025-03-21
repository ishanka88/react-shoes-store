export interface Order {
    id?: any;
    amount?: number;
    deliverCharges?: number;
    createdAt?: Date|undefined;
    stock?: number;
    orderItems?: OrderItem[];
    status?: string;
    orderId?: string;
    tracking?: string;
    itemCount?: number;
    createdUserId?: string;
    createdUserRef?: string;
}
export interface OrderItem {
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

