import axios from "axios";
import { addDoc, collection, getDocs, query, where,updateDoc } from 'firebase/firestore';
import { auth, db } from "../firebase/firebaseConfig";
import { CUSTOMERS, PRODUCTS, CONTACTUS } from "../dbUtils";
import { User } from "@firebase/auth";
import { UserDetails } from "../models/User";
import { Product } from "../models/Products";
import { Contact } from "../models/Contactus";

export class AdminService {
    public static async getAllUsers() {
        try {
            const q = query(collection(db, CUSTOMERS), where('role', '==', 'USER'));
            const querySnapshot = await getDocs(q);
            const data: UserDetails[] = [];
            querySnapshot.forEach(doc => {
                const donor = doc.data() as UserDetails;
                console.log(donor)
                donor.id = doc.id;
                data.push(donor);
            });
            return data;
        } catch (e) {
            return e;
        }
    };

    public static async addProduct(product: Product) {
        try {
            // Add the product to Firestore and get the reference to the document
            const docRef = await addDoc(collection(db, PRODUCTS), product);
    
            // Add the document ID to the product object
            const productWithId = {
                ...product,
                id: docRef.id  // This adds the generated document ID to the product object
            };
    
            // Optionally, you can now update the document with the added `id` field if you want
            await updateDoc(docRef, { id: docRef.id });
    
            return productWithId; // Returning the product object with the document ID
        } catch (e) {
            console.log('Product added Error!', e);
            return e;
        }
    };

    public static async addContact(contact: Contact) {
        try {
            const user = await addDoc(collection(db, CONTACTUS), contact);
            return user;
        } catch (e) {
            console.log('Product added Erroee\r!', e);
            return e;
        }
    };
}
