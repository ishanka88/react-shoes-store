import { getFirestore, collection, doc, updateDoc, getDocs,getDoc, addDoc, query, where ,Timestamp} from 'firebase/firestore';
import{db} from "../firebase/firebaseConfig"
import { ORDERS, PRODUCTS,SYSTEM} from "../dbUtils";


export const updateOrderStatus = async (orderId: number, newStatus: string) => {
    try {
        // Get the reference to the specific order document in Firestore
        const orderRef = doc(db, ORDERS, orderId.toString());

        // Update the status field of the order document
        await updateDoc(orderRef, {
            status: newStatus
        });

        console.log(`Order ${orderId} status updated to ${newStatus}`); // Log after update

        return true; // Return true after successful update
    } catch (error) {
        console.error("Error updating order status:", error);
        return false; // Return false if an error occurs
    }
};

export const updateOrderStatusAndTrackingNo = async (orderId: number, newStatus: string, trackingNo: string) => {
    try {
        // Get the reference to the specific order document in Firestore
        const orderRef = doc(db, ORDERS, orderId.toString());

        // Update the status field of the order document
        await updateDoc(orderRef, {
            status: newStatus,
            tracking: trackingNo
        });

        console.log(`Order ${orderId} status updated to ${newStatus}`); // Log after update

        return true; // Return true after successful update
    } catch (error) {
        console.error("Error updating order status:", error);
        return false; // Return false if an error occurs
    }
};