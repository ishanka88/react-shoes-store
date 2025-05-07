// context/UserContext.tsx
import React, { createContext, useState, useEffect, ReactNode, useContext } from 'react';
import { auth } from '../firebase/firebaseConfig';
import { UserDetails } from '../services/UserDetails';

interface UserContextType {
  isAuthenticated: boolean | null;
  isAdmin: boolean;
  isModerator: boolean;
  userData: any;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isModerator, setIsModerator] = useState(false);
  const [userData, setUserData] = useState<any>(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
        if (user) {
            setIsAuthenticated(true);
            const res = await UserDetails.getUserDetails();
            setUserData(res);

            if (res?.role === 'admin') {
                setIsAdmin(true);
                setIsModerator(false);
            } else if (res?.role === 'moderator') {
                setIsModerator(true);
                setIsAdmin(false);
            } else {
                setIsAdmin(false);
                setIsModerator(false);
            }
        } else {
            setIsAuthenticated(false);
            setIsAdmin(false);
            setIsModerator(false);
            setUserData(null);
        }
    });

    return () => unsubscribe();
  }, []);

  return (
    <UserContext.Provider value={{ isAuthenticated, isAdmin, isModerator, userData }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUserContext = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUserContext must be used within a UserProvider');
  }
  return context;
};
