import { addDoc, collection, deleteDoc, doc as firestoreDoc, getDoc, getDocs, updateDoc } from 'firebase/firestore';
import firestore from '../config-global';

// Collection name
const ijinCollectionName = 'ijins';

// Create a new ijin entry
export const createIjin = async (ijinData) => {
  try {
    const completeIjinData = {
      title: ijinData.title,
      author: ijinData.author || '',
      university: ijinData.university || '',
      year: ijinData.year || '',
      description: ijinData.description || '',
    };

    const docRef = await addDoc(collection(firestore, ijinCollectionName), completeIjinData);
    console.log("Ijin document written with ID: ", docRef.id);
    return { id: docRef.id, ...completeIjinData };
  } catch (e) {
    console.error("Error adding ijin document: ", e);
    throw new Error(e.message);
  }
};

// Update an ijin entry
export const updateIjin = async (id, updatedData) => {
  try {
    const docRef = firestoreDoc(firestore, ijinCollectionName, id);

    // Ensure no invalid characters in field names and remove undefined values
    const sanitizedData = {};
    Object.keys(updatedData).forEach(key => {
      const value = updatedData[key];

      if (value !== undefined) {  // Filter out undefined values
        // Replace invalid characters or handle accordingly
        const sanitizedKey = key.replace(/[~*/[\]]/g, '_').replace(/\s+/g, '_');
        sanitizedData[sanitizedKey] = value;
      }
    });

    await updateDoc(docRef, sanitizedData);
    console.log("Ijin document updated with ID: ", id);
    return { id, ...sanitizedData };
  } catch (e) {
    console.error("Error updating ijin document: ", e);
    throw new Error(e.message);
  }
};

// Delete an ijin entry
export const deleteIjin = async (id) => {
  try {
    const docRef = firestoreDoc(firestore, ijinCollectionName, id);
    await deleteDoc(docRef);
    console.log("Ijin document deleted with ID: ", id);
  } catch (e) {
    console.error("Error deleting ijin document: ", e);
    throw e;
  }
};

// Get all ijin entries
export const getAllIjins = async () => {
  try {
    const querySnapshot = await getDocs(collection(firestore, ijinCollectionName));
    const ijins = querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        title: data.title || '',
        author: data.author || '',
        university: data.university || '',
        year: data.year || '',
        description: data.description || ''
      };
    });
    return ijins;
  } catch (e) {
    console.error("Error getting ijin documents: ", e);
    throw new Error(e.message);
  }
};

// Fetch an ijin entry by ID
export const getIjinById = async (id) => {
  try {
    const docRef = firestoreDoc(firestore, ijinCollectionName, id);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      console.error(`No such ijin document with ID: ${id}`);
      throw new Error('No such document!');
    }

    // Extracting the necessary fields
    const { title, author, university, year, description } = docSnap.data();

    return {
      id: docSnap.id,
      title: title || '',
      author: author || '',
      university: university || '',
      year: year || '',
      description: description || ''
    };
  } catch (e) {
    console.error("Error getting ijin document: ", e);
    throw new Error(e.message);
  }
};
