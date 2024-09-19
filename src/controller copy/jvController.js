import { addDoc, arrayUnion, collection, deleteDoc, doc as firestoreDoc, getDoc, getDocs, serverTimestamp, updateDoc } from 'firebase/firestore';
import firestore from '../config-global';

// Collection name
const collectionName = 'jvform';

// Add JV Property
export const addJVProperty = async (data) => {
  try {
    const propertyData = {
      approachRoadWidth: data.approachRoadWidth,
      goodwill: data.goodwill,
      imageUrl: data.imageUrl,
      landSize: data.landSize,
      ratioToBuilder: data.ratioToBuilder,
      ratioToLandlord: data.ratioToLandlord,
      refundableAdvance: data.refundableAdvance,
      termsAndConditions: data.termsAndConditions,
      createdAt: serverTimestamp()
    };

    // Use addDoc to add a new document with an automatically generated ID
    const docRef = await addDoc(collection(firestore, collectionName), propertyData);
    console.log("Document written with ID: ", docRef.id);
    return docRef.id;
  } catch (e) {
    console.error("Error adding document: ", e);
    throw e;
  }
};

// Get all JV Properties
export const getJVProperties = async () => {
  try {
    const querySnapshot = await getDocs(collection(firestore, collectionName));
    return querySnapshot.docs.map(doc => {
      const docData = doc.data();
      const date = docData.createdAt ? docData.createdAt.toDate() : null;
      const formattedDate = date ? `${date.toLocaleDateString()} ${date.toLocaleTimeString()}` : "N/A";
      return { id: doc.id, ...docData, createdAt: date, formattedDate };
    });
  } catch (e) {
    console.error("Error getting documents: ", e);
    throw e;
  }
};

// Get JV Property by ID
export const getJVPropertyByID = async (id) => {
  try {
    const docRef = firestoreDoc(firestore, collectionName, id);
    const docSnapshot = await getDoc(docRef);

    if (!docSnapshot.exists()) {
      throw new Error('Property not found');
    }

    const propertyData = docSnapshot.data();
    const date = propertyData.createdAt ? propertyData.createdAt.toDate() : null; // Convert Firestore timestamp to Date object
    const formattedDate = date ? `${date.toLocaleDateString()} ${date.toLocaleTimeString()}` : "N/A"; // Format date including time

    return { id: docSnapshot.id, ...propertyData, createdAt: date, formattedDate };
  } catch (e) {
    console.error("Error getting property: ", e);
    throw e;
  }
};

export const getTotalJVPropertiesCount = async () => {
  try {
    const querySnapshot = await getDocs(collection(firestore, collectionName));
    const count = querySnapshot.size; // Get the number of documents
    console.log(`Total properties count: ${count}`);
    return count;
  } catch (e) {
    console.error("Error getting total properties count: ", e);
    throw new Error(e.message);
  }
};
// Update JV Property
export const updateJVProperty = async (id, data) => {
  try {
    // Validate data
    if (!id || !data) {
      throw new Error("Invalid ID or data");
    }

    const docRef = firestoreDoc(firestore, collectionName, id);

    // Use updateDoc to update only specified fields
    await updateDoc(docRef, data);
    console.log(`Document with ID ${id} successfully updated.`);
  } catch (e) {
    console.error("Error updating document: ", e);
    throw e;
  }
};

// Update JV Property status
export const updateJVPropertyStatus = async (propertyId, status) => {
  try {
    const docRef = firestoreDoc(firestore, collectionName, propertyId);
    await updateDoc(docRef, { status });
    console.log(`Property status updated to ${status} for Property ID: ${propertyId}`);
  } catch (e) {
    console.error("Error updating property status: ", e);
    throw new Error(e.message);
  }
};

// Update JV Property Status With Comments
export const updatePropertyStatusWithComments = async (propertyId, status, comment, dateTimeArray) => {
  try {
    const docRef = firestoreDoc(firestore, collectionName, propertyId);

    const updateData = {
      updatedAt: serverTimestamp() // This will not be an array, just a single timestamp
    };

    if (status !== undefined) {
      const statusArray = Array.isArray(status) ? status : [status];
      updateData.status = arrayUnion(...statusArray);
    }

    if (comment !== undefined) {
      const commentArray = Array.isArray(comment) ? comment : [comment];
      updateData.comment = arrayUnion(...commentArray);
    }

    if (dateTimeArray !== undefined) {
      updateData.dateTimes = arrayUnion(...dateTimeArray);
    }

    await updateDoc(docRef, updateData);
    console.log(`Property status updated to ${status} with comments for property ID: ${propertyId}`);
  } catch (e) {
    console.error("Error updating property status: ", e);
    throw new Error(e.message);
  }
};

// Delete JV Property
export const deleteJVProperty = async (id) => {
  try {
    const docRef = firestoreDoc(firestore, collectionName, id);
    await deleteDoc(docRef);
    console.log(`Document with ID ${id} successfully deleted.`);
  } catch (e) {
    console.error("Error deleting document: ", e);
    throw e;
  }
};
