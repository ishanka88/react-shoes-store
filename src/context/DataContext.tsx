// DataContext.tsx
import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { db } from '../firebase/firebaseConfig';
import { Product } from '../models/Products';
import { collection, getDocs, query,orderBy } from 'firebase/firestore';

interface DataContextType {
  productsList: Product[]; // Adjust the type based on your data structure
  loading: boolean;
  refetchProducts: () => Promise<void>; // Expose a refetch method
}

// Typing the children prop correctly
interface DataProviderProps {
    children: ReactNode; // This ensures that children can be any valid React content
  }

const DataContext = createContext<DataContextType | undefined>(undefined);

const DataProvider: React.FC<DataProviderProps> = ({ children }) => {
  const [productsList, setProductsList] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch data from Firestore collection on mount
  const fetchProducts = async () => {
    try {
      // const shoesProductsQuery = query(collection(db, 'Products'), where('category', '==', category));
      const shoesProductsQuery = query(collection(db, 'Products'),orderBy('displayOrder'));
      const shoesProductsSnapshot = await getDocs(shoesProductsQuery);

          // Map through the docs and get both the document ID and data
      // Map through documents and include `id` in each product's data
      const fetchedData = shoesProductsSnapshot.docs.map((doc) => ({
        ...doc.data(), // Merge the document fields (data) into the product
      }));

      console.log(fetchedData)

      // Update the state with the fetched data
      setProductsList(fetchedData as Product[]);

  } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {

      fetchProducts();

  }, []);

  return (
    <DataContext.Provider value={{ productsList, loading, refetchProducts: fetchProducts }}>
      {children}
    </DataContext.Provider>
  );
};

const useProductData = () => {
  const context = React.useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

export { DataProvider, useProductData };
