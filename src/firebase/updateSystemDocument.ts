import {  doc, getDoc,  updateDoc} from "firebase/firestore";
import { SYSTEM} from "../dbUtils";
import { db } from "../firebase/firebaseConfig";
import { waybillErrorMessages , WaybillErrorCode} from "../utils/waybillErrors";

export async function updateLastOrderTracking(trackingNo: number): Promise<boolean> {
    try {
      const systemRef = doc(db, SYSTEM, "order_counter");
      const systemDoc = await getDoc(systemRef);
  
      if (systemDoc.exists()) {
        await updateDoc(systemRef, { currentTracking: trackingNo });
        console.log("Tracking number updated successfully.");
        return true;
      } else {
        console.warn("Order placed, but Firestore tracking values not found.");
        alert("Order placed successfully, but failed to update tracking in the database.");
        return false;
      }
    } catch (error) {
      console.error("Failed to update tracking number:", error);
      alert("Something went wrong while updating tracking information.");
      return false;
    }
  }


  export async function updateFinalTracking(trackingNo: number): Promise<boolean> {
    try {
      const systemRef = doc(db, SYSTEM, "order_counter");
      const systemDoc = await getDoc(systemRef);
  
      if (systemDoc.exists()) {
        await updateDoc(systemRef, { lastTracking: trackingNo });
        console.log("Last Tracking number updated successfully.");
        return true;
      } else {
        console.warn("Order placed, but Firestore tracking values not found.");
        alert("Failed to update Last tracking in the database.");
        return false;
      }
    } catch (error) {
      console.error("Failed to update tracking number:", error);
      alert("Something went wrong while updating tracking information.");
      return false;
    }
  }
  