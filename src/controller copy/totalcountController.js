import { collection, getDocs } from 'firebase/firestore';
import firestore from '../config-global';

export const getTotalUsersCount = async () => {
    try {
      const querySnapshot = await getDocs(collection(firestore, 'users'));
      const count = querySnapshot.size; // Get the number of documents
      console.log(`Total properties count: ${count}`);
      return count;
    } catch (e) {
      console.error("Error getting total properties count: ", e);
      throw new Error(e.message);
    }
  };
  export const getTotalJournalsCount = async () => {
    try {
      const querySnapshot = await getDocs(collection(firestore, 'journals'));
      const count = querySnapshot.size; // Get the number of documents
      console.log(`Total properties count: ${count}`);
      return count;
    } catch (e) {
      console.error("Error getting total properties count: ", e);
      throw new Error(e.message);
    }
  };
  export const getTotalconferencesCount = async () => {
    try {
      const querySnapshot = await getDocs(collection(firestore, 'conferences'));
      const count = querySnapshot.size; // Get the number of documents
      console.log(`Total properties count: ${count}`);
      return count;
    } catch (e) {
      console.error("Error getting total properties count: ", e);
      throw new Error(e.message);
    }
  };