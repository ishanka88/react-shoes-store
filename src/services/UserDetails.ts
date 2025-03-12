import { getAuth, IdTokenResult, User } from "firebase/auth";

// Get the auth instance
const auth = getAuth();

export class UserDetails {
  // Method to retrieve the user's role and other details and return them
  async getUserDetails() {
    try {
      const user = auth.currentUser;

 

      if (user) {
        // Get the ID token result, which includes user claims (like role)
        const idTokenResult: IdTokenResult = await user.getIdTokenResult();

    
        
        // Get the user's role from the claims
        const role: string | undefined = idTokenResult.claims.role as string;

        console.log("awa")
        console.log(role)
        console.log("awa")

        // Access other user details
        const email: string | null = user.email;
        const uid: string = user.uid;

        // Return the user details as an object
        return {
          role,
          email,
          uid,
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
