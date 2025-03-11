import axios from "axios";
import { AppResponse } from "../models/Response";
import { User, UserDetails } from "../models/User";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { addDoc, collection, doc, getDoc, getDocs, query, where } from 'firebase/firestore';
import { auth, db } from "../firebaseConfig";
import { CUSTOMERS } from "../dbUtils";

export interface UserLoginData {
  email: string;
  password: string;
}

export interface UserUpdateData {
  email: string;
}


export class AuthService {


  public static async userLogin(email: string, password: string) {
  
    const data = await signInWithEmailAndPassword(auth, email, password);
    return data;
  }

  public static async getUserFromEmail(email: string) {
    try {
      const q = query(collection(db, CUSTOMERS), where('email', '==', email));
      const querySnapshot = await getDocs(q);
      const data: User[] = [];
      querySnapshot.forEach(doc => {
        const donor = doc.data() as User;
        data.push(donor);
      });
      console.log(data[0])
      return data[0];
    } catch (e) {
      return e;
    }
  };


}
