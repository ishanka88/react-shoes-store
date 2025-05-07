import axios from "axios";
import { AppResponse } from "../models/Response";
import { UserInfo } from "../models/UserInfo";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { addDoc, collection, doc, getDoc, getDocs, query, where,setDoc,updateDoc, arrayUnion } from 'firebase/firestore';
import { auth, db } from "../firebase/firebaseConfig";
import { CUSTOMERS } from "../dbUtils";



export interface UserLoginData {
  email: string;
  password: string;
}

export interface UserUpdateData {
  email: string;
}


export class AuthService {

  public static async addNewCustomer(newCustomerData:UserInfo,uid:string) {
    try {
      // Reference to the user's document in the 'customers' collection
      const userDocRef = doc(db,CUSTOMERS,uid);
      // Set the new document data for the user
      await setDoc(userDocRef, newCustomerData);
      // Return the newly created customer data
      return newCustomerData;
    } catch (e) {
      console.error('Error creating customer document:', e);
      return null;
    }
}


  public static async getUserFromEmail(email: string) {
    try {
      const q = query(collection(db, CUSTOMERS), where('email', '==', email));
      const querySnapshot = await getDocs(q);
      const data: UserInfo[] = [];
      querySnapshot.forEach(doc => {
        const donor = doc.data() as UserInfo;
        data.push(donor);
      });
      return data[0];
    } catch (e) {
      return e;
    }
  };


  public static async getUserFromUid(uid: string) {
    try {
      const userDocRef = doc(db, CUSTOMERS, uid);
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {
        console.log("User document found");
        return userDoc.data();  // Call .data() to get the document data
      } else {
        console.log("No User document found");
        return null;  // Return null if document does not exist
      }
    } catch (e) {
      console.error('Error getting user document:', e);  // It's a good practice to log the error
      return null;  // Return null in case of an error
    }
  }
  
  public static async  addOrderIdToCustomer (customerId: string, orderId: number){
    try {
      const customerRef = doc(db, CUSTOMERS, customerId);
  
      await updateDoc(customerRef, {
        orders: arrayUnion(orderId),
      });
  
      console.log("Order ID added to customer successfully.");
      return true;
    } catch (error) {
      console.error("Error adding order ID to customer:", error);
      return false;
    }
  };

}
