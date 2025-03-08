export interface Order {
    id?: any;
    amount?: number;
    createdAt?: Date;
    stock?: number;
    orderItems?: OrderItem[];
    status?: string;
    orderId?: string;
    itemCount?: number;
    createdUserId?: string;
    createdUserRef?: string;
}
export interface OrderItem {
    id?: any;
    title?: string;
    price?: number;
    item: {
        category?: string;
        price?: string;
        title?: string;
    }
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

