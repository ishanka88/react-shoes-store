import {  doc, getDoc,  updateDoc} from "firebase/firestore";
import { SYSTEM} from "../dbUtils";
import { db } from "../firebase/firebaseConfig";
import { waybillErrorMessages , WaybillErrorCode} from "../utils/waybillErrors";


interface PostData {
    api_key: string;
    client_id: string;
    waybill_id: string;
    order_id: string;
    parcel_weight: string;
    parcel_description: string;
    recipient_name: string;
    recipient_contact_1: string;
    recipient_contact_2: string;
    recipient_address: string;
    recipient_city: string;
    amount: string;
    exchange: string;
  }


  
  const makeFetchRequest = async (
    url: string,
    postData: PostData
  ): Promise<any> => {
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams(postData as any),
      });
  
      const data = await response.json();
  
      const statusCode = parseInt(data.status, 10);
      console.log(data)
      const waybill_id = data.waybillID?.toString(); 

      if (isNaN(statusCode)) {
        throw new Error("Invalid status code in API response.");
      }
  
      if (statusCode === 200) {
        const systemRef = doc(db, SYSTEM, "order_counter");
        const systemDoc = await getDoc(systemRef);
  
        if (systemDoc.exists()) {
          await updateDoc(systemRef, { currentTracking: parseInt(postData.waybill_id) });
          console.log('API Response:', response);
          alert(`Successfully placed the order \n Waybil No : ${waybill_id}`)
        } else {
          console.warn("Order placed, but Firestore tracking values not found.");
          alert("Order placed successfully, but failed to update tracking in database.");
        }

        return true;
      } else {
          const errorCode = statusCode as WaybillErrorCode;
          const errorMessage = waybillErrorMessages[errorCode] || "Unknown error occurred.";
          console.error("Error response:", response);
          alert(`Error [${errorCode}]: ${errorMessage}\nWaybil No : ${waybill_id} `);
          return false;
      }
 
    } catch (error) {
      console.error("Fetch request failed:", error);
      alert("Something went wrong while processing your request.");
      return false;
    }
  };
  

  
  // Public function to call the API with dynamic data
  export const sendParcelData = async (
    waybill_id: string,
    order_id: string,
    parcel_weight: string,
    parcel_description: string,
    recipient_name: string,
    recipient_contact_1: string,
    recipient_contact_2: string,
    recipient_address: string,
    recipient_city: string,
    amount: string,
    exchange: string
  ): Promise<any> => {
    const apiEndpoint = "https://www.fdedomestic.com/api/parcel/existing_waybill_api_v1.php";
  
    // Constructing the postData object dynamically
    const postData: PostData = {
      api_key: process.env.REACT_APP_FDEDOMESTIC_API_KEY!, // Secure key from environment variables
      client_id: process.env.REACT_APP_FDEDOMESTIC_CLIENT_ID!, // Secure client ID from environment variables
      waybill_id,
      order_id,
      parcel_weight,
      parcel_description,
      recipient_name,
      recipient_contact_1,
      recipient_contact_2,
      recipient_address,
      recipient_city,
      amount,
      exchange,
    };
  
    // Call the fetch request function
    return makeFetchRequest(apiEndpoint, postData);
  };
  