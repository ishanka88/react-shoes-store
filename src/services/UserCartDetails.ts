import { getAuth, IdTokenResult, User } from "firebase/auth";
import { doc,setDoc } from "firebase/firestore";
import { CartItem } from "../models/CartItem";
import { AuthService } from "./AuthService";

import {db} from "../firebase/firebaseConfig"
import { CUSTOMERS } from "../dbUtils";
import { CardTitle } from "react-bootstrap";

// Get the auth instance
const auth = getAuth();

export class UserCartDetails {
  // Method to retrieve the user's role and other details and return them
  public static async getUserCartDetails() {
    let cartList :CartItem[]= []; 
    try {
      const user = auth.currentUser;
      if (user) {
        const uid: string = user.uid;
        const userDocData = await AuthService.getUserFromUid(uid);
        if (userDocData) {
          // Ensure `cart` is resolved from Firestore (it could be a promise or nested)
          cartList = userDocData.cart || [];  // Fallback to empty array if `cart` is not found
          if (cartList.length===0){
            const storedCart= localStorage.getItem('CartList');
            if (storedCart) {
              cartList = JSON.parse(storedCart);  // Parse the string to get the actual cart object
              UserCartDetails.addUserCartDetails(cartList)
              localStorage.removeItem('CartList');
            }

          }
        
        }
      } else {
        // Retrieve cart from localStorage if no user is logged in
        const storedCart = localStorage.getItem('CartList');
        if (storedCart) {
          cartList = JSON.parse(storedCart);  // Parse the string to get the actual cart object
        }
      }
  
      return cartList;  // Return the cart (resolved data)
    } catch (error) {
      console.error("Error retrieving user details:", error);
      return cartList;  // Return an empty array if an error occurs
    }
  }
  
  

  public static async addUserCartDetails(cartArray:CartItem[]) {
    try {
      const user = auth.currentUser;
      if (user) {
        try{
            const uid: string = user.uid;
            
            // Reference to the user's document in the "carts" collection (you can change the collection name)
            const userCartRef = doc(db, CUSTOMERS, uid);  // 'carts' is the collection, 'uid' is the document ID
    
            // Set the user's cart details (this will overwrite any existing cart data)
            await setDoc(userCartRef, {
              cart: cartArray  // Save the cart array
            });
    
            console.log("Cart details added successfully!");
    
            return true;

        } catch (error) {
            console.error("Error adding cart details:", error);
            return false;
        }
        
      } else {
        localStorage.setItem('CartList', JSON.stringify(cartArray));
        return true;  // If no user is signed in, return null
      }
    } catch (error) {
      console.error("Error retrieving user details:", error);
      return false;  // If there is an error, return null
    }
  }
}
