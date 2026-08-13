import { useState, useEffect } from 'react';
import { CatalogItem, Sale, INITIAL_CATALOG, User } from '../types';
import { collection, onSnapshot, doc, setDoc, deleteDoc, updateDoc, writeBatch } from 'firebase/firestore';
import { db } from '../lib/firebase';

export function useData(currentUser: User | null) {
  const [catalog, setCatalog] = useState<CatalogItem[]>([]);
  const [sales, setSales] = useState<Sale[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (!currentUser) {
      setIsLoaded(false);
      setCatalog([]);
      setSales([]);
      return;
    }

    let unsubCatalog = () => {};
    let unsubSales = () => {};

    try {
      unsubCatalog = onSnapshot(collection(db, 'catalog'), (snapshot) => {
        const catalogData = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as CatalogItem));
        
        if (catalogData.length === 0 && snapshot.metadata.fromCache === false && snapshot.metadata.hasPendingWrites === false) { 
           const batch = writeBatch(db);
           INITIAL_CATALOG.forEach(item => {
             const docRef = doc(collection(db, 'catalog'), item.id);
             batch.set(docRef, item);
           });
           batch.commit().catch(e => console.warn("Seed error:", e));
        }
        setCatalog(catalogData);
        setIsLoaded(true);
      }, (error) => {
        console.warn("Catalog snapshot error:", error);
        setIsLoaded(true);
      });
    } catch (e) {
      console.error("Error setting up catalog snapshot:", e);
      setIsLoaded(true);
    }

    try {
      unsubSales = onSnapshot(collection(db, 'sales'), (snapshot) => {
        const salesData = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as Sale));
        setSales(salesData);
      }, (error) => {
        console.warn("Sales snapshot error:", error);
      });
    } catch (e) {
      console.error("Error setting up sales snapshot:", e);
    }

    return () => {
      unsubCatalog();
      unsubSales();
    };
  }, [currentUser]);

  const saveCatalog = async (newCatalog: CatalogItem[]) => {
    const batch = writeBatch(db);
    const toDelete = catalog.filter(c => !newCatalog.find(nc => nc.id === c.id));
    toDelete.forEach(c => {
      batch.delete(doc(db, 'catalog', c.id));
    });
    newCatalog.forEach(c => {
      batch.set(doc(db, 'catalog', c.id), c);
    });
    await batch.commit();
  };

  const addSale = async (sale: Sale) => {
    await setDoc(doc(db, 'sales', sale.id), sale);
  };

  const updateSale = async (id: string, updatedSale: Sale) => {
    await updateDoc(doc(db, 'sales', id), { ...updatedSale });
  };

  const deleteSale = async (id: string) => {
    await deleteDoc(doc(db, 'sales', id));
  };

  const resetCatalog = async () => {
    const batch = writeBatch(db);
    catalog.forEach(c => {
      batch.delete(doc(db, 'catalog', c.id));
    });
    INITIAL_CATALOG.forEach(item => {
      batch.set(doc(db, 'catalog', item.id), item);
    });
    await batch.commit();
  };

  return {
    catalog,
    sales,
    isLoaded,
    saveCatalog,
    addSale,
    updateSale,
    deleteSale,
    resetCatalog
  };
}
