import { addDoc, collection, deleteDoc, doc as firestoreDoc, getDoc, getDocs, updateDoc } from 'firebase/firestore';
import firestore from '../config-global';

const authorCollectionName = 'authors';

// Add Author
export const addAuthor = async (author) => {
  try {
    const authorRef = await addDoc(collection(firestore, authorCollectionName), author);
    console.log("Author added with ID: ", authorRef.id);
    return { id: authorRef.id, ...author };
  } catch (error) {
    console.error('Error adding author: ', error);
    throw error;
  }
};

// Get Authors
export const getAuthors = async () => {
  try {
    const querySnapshot = await getDocs(collection(firestore, authorCollectionName));
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Error getting authors: ', error);
    throw error;
  }
};

// Get Author by ID
export const getAuthorByID = async (id) => {
  try {
    const authorRef = firestoreDoc(firestore, authorCollectionName, id);
    const authorDoc = await getDoc(authorRef);

    if (authorDoc.exists()) {
      return { id: authorDoc.id, ...authorDoc.data() };
    }

    console.log(`No author found with ID ${id}`);
    return null;
  } catch (error) {
    console.error('Error getting author:', error);
    throw error;
  }
};

// Update Author
export const updateAuthor = async (id, updatedData) => {
  try {
    const docRef = firestoreDoc(firestore, authorCollectionName, id);
    await updateDoc(docRef, updatedData);
    console.log("Author updated with ID: ", id);
    return { id, ...updatedData };
  } catch (error) {
    console.error('Error updating author: ', error);
    throw error;
  }
};

// Delete Author
export const deleteAuthor = async (id) => {
  try {
    const authorRef = firestoreDoc(firestore, authorCollectionName, id);
    await deleteDoc(authorRef);
  } catch (error) {
    console.error('Error deleting author: ', error);
    throw error;
  }
};
