import { getAuth, IdTokenResult, User } from "firebase/auth";
import { AuthService } from "./AuthService";
import {UserInfo} from "../models/UserInfo"

// Get the auth instance
const auth = getAuth();

export class UserDetails {
  // Method to retrieve the user's role and other details and return them
  public static async getUserDetails() {
    try {
      const user = auth.currentUser;
      var customerDetails=null;


      if (user) {
        // Get the ID token result, which includes user claims (like role)
        const idTokenResult: IdTokenResult = await user.getIdTokenResult();
        // Get the user's role from the claims
        const role: string | undefined = idTokenResult.claims.role as string;

        // Access other user details
        const email: string | null = user.email;
        const uid: string = user.uid;

        // Check if the user already has a customer document
        const userDocData = await AuthService.getUserFromUid(uid)

        if (!userDocData) {
          // If no document exists, create a new document in the 'customers' collection
          const newCustomerData: UserInfo = {
            id: user.uid,
            name: user.displayName || 'New User', // You can modify this based on user data
            address: '',
            city: '',
            tel1: '',
            tel2: '',
            cart: [], // Assuming no cart initially
            orders: [] // Assuming no cart initially
          };

          customerDetails = AuthService.addNewCustomer(newCustomerData,user.uid)
          console.log('New customer document created!');
        }else{
          customerDetails= userDocData
        }

        // Return the user details as an object
        return {
          role,
          email,
          uid,
          customerDetails

        };
      } else {
        console.log("No user is signed in.");
        return null;  // If no user is signed in, return null
      }
    } catch (error) {
      console.error("Error retrieving user details:", error);
      return null;  // If there is an error, return null
    }
  }
}
