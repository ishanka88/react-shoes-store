import { db } from '../firebase/firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';
import { Order } from '../models/Order'; // Adjust this path based on your project structure
import { ORDERS } from '../dbUtils';

// This function returns an array of orders, each with a Firestore ID included
export const getOrdersByIds = async (orderIds: string[]): Promise<(Order & { id: string })[]> => {
    console.log("Fetching orders...");
    
    // Map over the orderIds and fetch each document
    const orderPromises = orderIds.map(id => getDoc(doc(db, 'Orders', id)));
    const orderSnaps = await Promise.all(orderPromises);

    return orderSnaps
        .filter(docSnap => docSnap.exists()) // Only include existing documents
        .map(docSnap => ({
            id: docSnap.id,  // Firestore document ID (string)
            ...(docSnap.data() as Order),  // Map the Firestore data to your Order type
        }));
};
