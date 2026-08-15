import { useState, useEffect } from 'react';
import { User, INITIAL_USERS } from '../types';
import { collection, onSnapshot, doc, setDoc, deleteDoc, updateDoc, writeBatch } from 'firebase/firestore';
import { db } from '../lib/firebase';

export function useUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [isUsersLoaded, setIsUsersLoaded] = useState(false);

  useEffect(() => {
    let unsub = () => {};
    try {
      unsub = onSnapshot(collection(db, 'users'), (snapshot) => {
        const usersData = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as User & { id: string }));
        
        if (snapshot.metadata.fromCache === false && snapshot.metadata.hasPendingWrites === false) {
            const existingUsernames = usersData.map(u => u.username);
            const missingUsers = INITIAL_USERS.filter(u => !existingUsernames.includes(u.username));
            
            const batch = writeBatch(db);
            let hasUpdates = false;

            if (missingUsers.length > 0) {
              missingUsers.forEach(u => {
                const docRef = doc(collection(db, 'users'), u.username);
                batch.set(docRef, u);
              });
              hasUpdates = true;
            }

            const queenDb = usersData.find(u => u.username === 'QUEEN');
            const queenInitial = INITIAL_USERS.find(u => u.username === 'QUEEN');
            if (queenDb && queenInitial && queenDb.pin !== queenInitial.pin && queenInitial.pin === 'Primavera2026') {
               const docRef = doc(collection(db, 'users'), 'QUEEN');
               batch.update(docRef, { pin: 'Primavera2026' });
               hasUpdates = true;
            }

            if (hasUpdates) {
              batch.commit().catch(e => console.warn("Seed users error:", e));
            }
        }
        setUsers(usersData.length > 0 ? usersData : INITIAL_USERS as any);
        setIsUsersLoaded(true);
      }, (error) => {
        console.warn("Users snapshot error:", error);
        setIsUsersLoaded(true);
      });
    } catch (e) {
      console.error("Error setting up users snapshot:", e);
      setIsUsersLoaded(true);
    }
    return () => unsub();
  }, []);

  const addUser = async (user: User) => {
    await setDoc(doc(db, 'users', user.username), user);
  };

  const updateUser = async (username: string, updatedUser: User) => {
    // If username changed, we'd need to delete old and create new.
    // For simplicity, we can assume username is the ID and cannot be changed, or handle it properly.
    if (username !== updatedUser.username) {
       await deleteDoc(doc(db, 'users', username));
    }
    await setDoc(doc(db, 'users', updatedUser.username), updatedUser);
  };

  const deleteUser = async (username: string) => {
    await deleteDoc(doc(db, 'users', username));
  };

  return {
    users,
    isUsersLoaded,
    addUser,
    updateUser,
    deleteUser
  };
}
