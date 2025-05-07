import {  doc, getDoc,  updateDoc} from "firebase/firestore";
import { SYSTEM} from "../dbUtils";
import { db } from "./firebaseConfig";
import { waybillErrorMessages , WaybillErrorCode} from "../utils/waybillErrors";



export async function getCurrentTracking(): Promise<number | null> {
  try {
    const systemRef = doc(db, SYSTEM, "order_counter");
    const systemDoc = await getDoc(systemRef);

    if (systemDoc.exists()) {
      const data = systemDoc.data();
      const lastTracking = data.lastOrderTracking ?? null;

      return lastTracking;
    } else {
      console.warn("Tracking document does not exist.");
      return null;
    }
  } catch (error) {
    console.error("Error getting current tracking:", error);
    return null;
  }
}

export async function getBothCurrentAndLastTrackings(): Promise<[number | null, number | null] | null> {
  try {
    const systemRef = doc(db, SYSTEM, "order_counter");
    const systemDoc = await getDoc(systemRef);

    if (systemDoc.exists()) {
      const data = systemDoc.data();
      const currentTracking = data.lastOrderTracking ?? null;
      const lastTracking = data.finalTracking ?? null;

      return [currentTracking, lastTracking];
    } else {
      console.warn("Tracking document does not exist.");
      return null;
    }
  } catch (error) {
    console.error("Error getting current tracking:", error);
    return null;
  }
}


export async function getBothWebsiteAndManualOrderIds(): Promise<[number | null, number | null] | null> {
  try {
    const systemRef = doc(db, SYSTEM, "order_counter");
    const systemDoc = await getDoc(systemRef);

    if (systemDoc.exists()) {
      const data = systemDoc.data();
      const websiteOrderId = data.lastOrderIdWebsite?? null;
      const manualOrderId = data.lastOrderIdManual ?? null;


      return [websiteOrderId, manualOrderId];
    } else {
      console.warn("Tracking document does not exist.");
      return null;
    }
  } catch (error) {
    console.error("Error getting current tracking:", error);
    return null;
  }
}

export async function getLastManualOrderId(): Promise<number | null> {
  try {
    const systemRef = doc(db, SYSTEM, "order_counter");
    const systemDoc = await getDoc(systemRef);

    if (systemDoc.exists()) {
      const data = systemDoc.data();
      const lastOrderIdManual = data.lastOrderIdManual ?? null;
      return lastOrderIdManual;
    } else {
      console.warn("Tracking document does not exist.");
      return null;
    }
  } catch (error) {
    console.error("Error getting current tracking:", error);
    return null;
  }
}

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

  export async function updateBothCurrentAndLastTrackings(currentTracking: number, lastTracking: number): Promise<boolean> {
    try {
      const systemRef = doc(db, SYSTEM, "order_counter");
      await updateDoc(systemRef, {
        lastOrderTracking: currentTracking,
        finalTracking: lastTracking,
      });
      console.log("Tracking values updated successfully.");
      return true;
    } catch (error) {
      console.error("Error updating tracking values:", error);
      return false;
    }
  }

  export async function updateWebsiteLastOrderId(orderId: number): Promise<boolean> {
    try {
      const systemRef = doc(db, SYSTEM, "order_counter");
      const systemDoc = await getDoc(systemRef);
  
      if (systemDoc.exists()) {
        await updateDoc(systemRef, { lastOrderIdWebsite: orderId });
        console.log("Website Order Id updated successfully.");
        return true;
      } else {
        console.warn("Firestore website order id values not found.");
        alert("Firestore website order id values not found.");
        return false;
      }
    } catch (error) {
      console.error("Failed to update website order ID:", error);
      alert("Something went wrong while updating website Last order ID.");
      return false;
    }
  }

  export async function updateManualLastOrderId(orderId: number): Promise<boolean> {
    try {
      const systemRef = doc(db, SYSTEM, "order_counter");
      const systemDoc = await getDoc(systemRef);
  
      if (systemDoc.exists()) {
        await updateDoc(systemRef, { lastOrderIdManual: orderId });
        console.log("Manual Order Id updated successfully.");
        return true;
      } else {
        console.warn("Firestore Manual order id values not found.");
        alert("Firestore Manual order id values not found.");
        return false;
      }
    } catch (error) {
      console.error("Failed to update Manual order ID:", error);
      alert("Something went wrong while updating Manual Last order ID.");
      return false;
    }
  }

  