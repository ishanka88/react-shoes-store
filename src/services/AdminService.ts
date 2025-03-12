import axios from "axios";
import { addDoc, collection, getDocs, query, where } from 'firebase/firestore';
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
            const user = await addDoc(collection(db, PRODUCTS), product);
            return user;
        } catch (e) {
            console.log('Product added Erroee\r!', e);
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
