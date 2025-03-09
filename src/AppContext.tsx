import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { onAuthStateChanged, User, signInWithEmailAndPassword, signOut as firebaseSignOut } from 'firebase/auth';
import { auth, db } from './firebase/firebase'; // Import your Firebase utils
import { doc, getDoc, setDoc } from 'firebase/firestore';

import { CartItem } from './models/CartItem';

// AppContext value type
interface AppContextType {
  user: User | null;
  cart: CartItem[];
  isCartLoading: boolean;
  isAuthenticated: boolean;
  signIn: (email: string, password: string) => void;
  signOut: () => void;
  addToCart: (item: CartItem) => void;
}

// Create Context with default values
const AppContext = createContext<AppContextType | undefined>(undefined);

// Custom Hook to use the AppContext
export const useAppContext = (): AppContextType => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};

// Define types for the provider props
interface AppProviderProps {
  children: ReactNode;
}

// AppContext Provider
export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartLoading, setIsCartLoading] = useState<boolean>(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        await fetchCartData(currentUser.uid);
      } else {
        setUser(null);
        setCart([]);
      }
    });

    return () => unsubscribe();
  }, []);

  const fetchCartData = async (userId: string) => {
    try {
      const cartDocRef = doc(db, 'carts', userId);
      const cartDoc = await getDoc(cartDocRef);

      if (cartDoc.exists()) {
        setCart(cartDoc.data()?.cart || []); // Ensure safe access to cart field
      } else {
        await setDoc(cartDocRef, { cart: [] });
        setCart([]);
      }
    } catch (error) {
      console.error('Error fetching cart data:', error);
    } finally {
      setIsCartLoading(false);
    }
  };

  const addToCart = async (item: CartItem) => {
    if (!user) return;

    const updatedCart = [...cart, item];
    setCart(updatedCart);

    try {
      const cartDocRef = doc(db, 'carts', user.uid);
      await setDoc(cartDocRef, { cart: updatedCart });
    } catch (error) {
      console.error('Error updating cart:', error);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      setUser(userCredential.user);
    } catch (error) {
      console.error('Error signing in:', error);
    }
  };

  const signOut = async () => {
    try {
      await firebaseSignOut(auth);
      setUser(null); // Reset local user state after signing out
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const value: AppContextType = {
    user,
    cart,
    isCartLoading,
    isAuthenticated: !!user,
    signIn,
    signOut,
    addToCart,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
