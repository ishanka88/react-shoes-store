import { auth } from "./firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  sendEmailVerification,
  updatePassword,
  signInWithPopup,
  GoogleAuthProvider,
  UserCredential,
  AuthProvider,
} from "firebase/auth";

export const doCreateUserWithEmailAndPassword = async (
  email: string,
  password: string
): Promise<UserCredential> => {
  return createUserWithEmailAndPassword(auth, email, password);
};

export const doSignInWithEmailAndPassword = (
  email: string,
  password: string
): Promise<UserCredential> => {
  return signInWithEmailAndPassword(auth, email, password);
};

export const doSignInWithGoogle = async (): Promise<UserCredential> => {
  const provider: AuthProvider = new GoogleAuthProvider();
  const result: UserCredential = await signInWithPopup(auth, provider);
  const user = result.user;

  // Add user to firestore logic here
  return result;
};

export const doSignOut = (): Promise<void> => {
  return auth.signOut();
};

export const doPasswordReset = (email: string): Promise<void> => {
  return sendPasswordResetEmail(auth, email);
};

export const doPasswordChange = (password: string): Promise<void> => {
  if (auth.currentUser) {
    return updatePassword(auth.currentUser, password);
  }
  return Promise.reject(new Error("No authenticated user"));
};

export const doSendEmailVerification = (): Promise<void> => {
  if (auth.currentUser) {
    return sendEmailVerification(auth.currentUser, {
      url: `${window.location.origin}/home`,
    });
  }
  return Promise.reject(new Error("No authenticated user"));
};