import { addDoc, collection, deleteDoc, doc as firestoreDoc, getDoc, getDocs, updateDoc } from 'firebase/firestore';
import { getDownloadURL, getStorage, ref, uploadBytes } from 'firebase/storage';
import firestore from '../config-global';

// Collection name
const ijinCollectionName = 'ijins';

const uploadFiles = async (files, folder = 'ijin_covers') => {
  const storage = getStorage();
  const uploadPromises = files.map(async (file) => {
    const storageRef = ref(storage, `${folder}/${file.name}`);
    const snapshot = await uploadBytes(storageRef, file);
    return getDownloadURL(snapshot.ref);
  });
  return Promise.all(uploadPromises);
};
// Create a new ijin entry
export const createIjin = async (ijinData) => {
  try {
    const completeijinData = {
      title: ijinData.title,
      issnPrint: ijinData.issnPrint || '',
      issnOnline: ijinData.issnOnline || '',
      yearOfStarting: ijinData.yearOfStarting || '',
      licenseType: ijinData.licenseType || '',
      ijin: ijinData.ijin || '',
      email:ijinData.email||'',
    };
    // Handle cover image upload
    if (ijinData.coverImage && ijinData.coverImage.length > 0) {
      const coverImageUrls = await uploadFiles(ijinData.coverImage, 'ijin_covers');
      completeijinData.coverImage = coverImageUrls;
    }

    const docRef = await addDoc(collection(firestore, ijinCollectionName), completeijinData);
    console.log("Document written with ID: ", docRef.id);
    return { id: docRef.id, ...completeijinData };
  } catch (e) {
    console.error("Error adding document: ", e);
    throw new Error(e.message);
  }
};

// Update an ijin entry
export const updateIjin = async (id, updatedData) => {
  try {
    const docRef = firestoreDoc(firestore, ijinCollectionName, id);
    // Handle cover image upload
    if (updatedData.coverImage && updatedData.coverImage.length > 0) {
      const coverImageUrls = await uploadFiles(updatedData.coverImage, 'journal_covers');
      updatedData.coverImage = coverImageUrls;
    }
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
        issnPrint: data. issnPrint || '',
        issnOnline:data. issnOnline || '',
        yearOfStarting: data.yearOfStarting || '',
        licenseType:data. licenseType || '',
        ijin:data. ijin || '',
        email:data. email || '',
        coverImage: data. coverImage || ''
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

    const { title, issnPrint, issnOnline, yearOfStarting, licenseType, ijin, email, coverImage } = docSnap.data();

    return {
      id: docSnap.id,
      title: title || '',
      issnPrint: issnPrint || '',
      issnOnline: issnOnline || '',
      yearOfStarting: yearOfStarting || '',
      licenseType: licenseType || '',
      ijin: ijin || '',
      email: email || '',
      coverImage: coverImage || ''
    }
  } catch (error) {
    console.error('Error fetching ijin by ID:', error);
    throw error;  // Re-throw the error to handle it where the function is called
  }
};

    
