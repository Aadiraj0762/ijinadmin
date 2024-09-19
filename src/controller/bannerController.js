import { addDoc, collection, deleteDoc, doc as firestoreDoc, getDoc, getDocs, updateDoc } from 'firebase/firestore';
import { getDownloadURL, getStorage, ref, uploadBytes } from 'firebase/storage';
import firestore from '../config-global';


// Collection name
const collectionName = 'banners';

// Create
export const addBanner = async (banner) => {
  try {
    const storage = getStorage();
    const storageRef = ref(storage, 'banner');
    // Handle multiple file uploads concurrently
    const uploadPromises = banner.images.map(async (file) => {
      const fileRef = ref(storageRef, file.name);
      await uploadBytes(fileRef, file);
      return getDownloadURL(fileRef);
    });
    // Wait for all uploads to complete and get download URLs
    const imageUrls = await Promise.all(uploadPromises);
    const bannerData = {
      title: banner.title,
      //   description: banner.description,
      images: imageUrls, // Store URLs or other relevant data
      //   link: banner.link || ''  // Default to an empty string if no link is provided
    };

    const bannerRef = await addDoc(collection(firestore, collectionName), bannerData);
    console.log("Document written with ID: ", bannerRef.id);
    return { id: bannerRef.id, ...bannerData };
  } catch (error) {
    console.error('Error adding banner: ', error);
    throw error;
  }
};

// Read
export const getBanners = async () => {
  try {
    const querySnapshot = await getDocs(collection(firestore, collectionName));
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Error getting banners: ', error);
    throw error;
  }
};

// Read by ID
export const getBannerByID = async (id) => {
  try {
    const bannerRef = firestoreDoc(firestore, collectionName, id);
    const bannerDoc = await getDoc(bannerRef);

    if (bannerDoc.exists()) {
      return { id: bannerDoc.id, ...bannerDoc.data() };
    }

    console.log(`No banner found with ID ${id}`);
    return null;
  } catch (error) {
    console.error('Error getting banner:', error);
    throw error;
  }
};

// Update
export const updateBanner = async (id, updatedData) => {
  const storage = getStorage();
  try {
    // Clone updatedData to avoid mutating the original object
    const dataToUpdate = { ...updatedData };

    // Check if dataToUpdate contains a file
    if (dataToUpdate.file) {
      const file = dataToUpdate.file;
      const storageRef = ref(storage, `banners/${id}/${file.name}`);
      
      // Upload the file to Firebase Storage
      const snapshot = await uploadBytes(storageRef, file);
      
      // Get the file's download URL
      const downloadURL = await getDownloadURL(snapshot.ref);
      
      // Replace the file object with the download URL in dataToUpdate
      dataToUpdate.fileURL = downloadURL;
      delete dataToUpdate.file;
    }

    console.log('Data to update before sending to Firestore:', dataToUpdate);

    // Update the Firestore document
    const docRef = firestoreDoc(firestore, 'banners', id);
    await updateDoc(docRef, dataToUpdate);

    console.log("Document updated with ID: ", id);
    return { id, ...dataToUpdate };

  } catch (error) {
    console.error('Error updating banner: ', error);
    throw new Error(error.message);
  }
};

// Delete
export const deleteBanner = async (id) => {
  try {
    const bannerRef = firestoreDoc(firestore, collectionName, id);
    await deleteDoc(bannerRef);
  } catch (error) {
    console.error('Error deleting banner: ', error);
    throw error;
  }
};
