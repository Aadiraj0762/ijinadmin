import { addDoc, collection, deleteDoc, doc as firestoreDoc, getDoc, getDocs, updateDoc } from 'firebase/firestore';
import firestore from '../config-global';

// Collection name
const collectionName = 'amenities';

// Create
export const addAmenity = async (amenity) => {
  try {
    const amenityData = {
      name: amenity.name,
      description: amenity.description,
      images: amenity.images || []  // Default to an empty array if no images are provided
    };

    const amenityRef = await addDoc(collection(firestore, collectionName), amenityData);
    return { id: amenityRef.id, ...amenityData };
  } catch (error) {
    console.error('Error adding amenity: ', error);
    throw error;
  }
};

// Read
export const getAmenities = async () => {
  try {
    const querySnapshot = await getDocs(collection(firestore, collectionName));
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error getting amenities: ", error);
    throw error;
  }
};

// Read by ID
export const getAmenityByID = async (id) => {
  try {
    const amenityRef = firestoreDoc(firestore, collectionName, id);
    const amenityDoc = await getDoc(amenityRef);

    if (amenityDoc.exists()) {
      return { id: amenityDoc.id, ...amenityDoc.data() };
    }

    console.log(`No amenity found with ID ${id}`);
    return null;
  } catch (error) {
    console.error('Error getting amenity:', error);
    throw error;
  }
};

// Update
export const updateAmenity = async (id, updatedData) => {
  try {
    const amenityRef = firestoreDoc(firestore, collectionName, id);
    await updateDoc(amenityRef, updatedData);
  } catch (error) {
    console.error('Error updating amenity: ', error);
    throw error;
  }
};

// Delete
export const deleteAmenity = async (id) => {
  try {
    const amenityRef = firestoreDoc(firestore, collectionName, id);
    await deleteDoc(amenityRef);
  } catch (error) {
    console.error('Error deleting amenity: ', error);
    throw error;
  }
};
