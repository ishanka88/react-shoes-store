import { initializeApp } from "firebase/app"
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore"



// const firebaseConfig = {
//   apiKey: "AIzaSyB34ETDWoWzo5ZynOQND2f_6OCsCdChEkk",
//   authDomain: "salicta-c56ad.firebaseapp.com",
//   projectId: "salicta-c56ad",
//   storageBucket: "salicta-c56ad.appspot.com",
//   messagingSenderId: "341279407350",
//   appId: "1:341279407350:web:a011b845e766c3d9af00d7"
// };

// Ensure you replace these with your actual Firebase credentials
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY!,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN!,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID!,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET!,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID!,
  appId: process.env.REACT_APP_FIREBASE_APP_ID!,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID!,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app)
const auth = getAuth(app);
export {db,auth}
