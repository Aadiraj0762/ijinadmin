import { arrayUnion, doc as firestoreDoc, getDoc, serverTimestamp, updateDoc } from 'firebase/firestore';
import firestore from '../config-global';

// Collection names
const CollectionName = 'property_services';



// Get interested property by ID
// export const getDetailedInterestedPropertyById = async (id) => {
//   try {
//     const docRef = firestoreDoc(firestore, interestedCollectionName, id);
//     const docSnap = await getDoc(docRef);

//     if (!docSnap.exists()) {
//       console.error(`No such document with ID: ${id}`);
//       throw new Error('No such document!');
//     }

//     const docData = docSnap.data();
//     const propertyId = docData.property_id;

//     if (propertyId) {
//       const propertyDocRef = firestoreDoc(firestore, propertiesCollectionName, propertyId);
//       const propertyDocSnap = await getDoc(propertyDocRef);

//       if (propertyDocSnap.exists()) {
//         const propertyData = propertyDocSnap.data();
        
//         return { id: docSnap.id, ...docData, propertyDetails: propertyData };
//       }
//     }

//     return { id: docSnap.id, ...docData };
//   } catch (e) {
//     console.error("Error getting document: ", e);
//     throw new Error(e.message);
//   }
// };



export const getInterestedPropertyById = async (id) => {
  try {
    const docRef = firestoreDoc(firestore, CollectionName, id);
    const docSnap = await getDoc(docRef);
    
    if (!docSnap.exists()) {
      console.error(`No such document with ID: ${id}`);
      throw new Error('No such document!');
    }
    
    return { id: docSnap.id, ...docSnap.data() };
  } catch (e) {
    console.error("Error getting document: ", e);
    throw new Error(e.message);
  }
};


// Update property status with comments
export const updatePropertyStatusWithComments = async (propertyId, status, comment, dateTimeArray) => {
  try {
    // Reference to the specific document in the 'interested' collection
    const docRef = firestoreDoc(firestore, 'property_services', propertyId);

    // Initialize updateData object
    const updateData = {
      updatedAt: serverTimestamp() // This will not be an array, just a single timestamp
    };

    // Ensure status is defined and add it to updateData if it is
    if (status !== undefined) {
      const statusArray = Array.isArray(status) ? status : [status];
      updateData.status = arrayUnion(...statusArray);
    }

    // Ensure comment is defined and add it to updateData if it is
    if (comment !== undefined) {
      const commentArray = Array.isArray(comment) ? comment : [comment];
      updateData.comment = arrayUnion(...commentArray);
    }

    // Ensure dateTimeArray is defined and add it to updateData if it is
    if (dateTimeArray !== undefined) {
      updateData.dateTimes = arrayUnion(...dateTimeArray);
    }

    // Update the document in Firestore
    await updateDoc(docRef, updateData);

    console.log(`Property status updated to ${status} with comments for property ID: ${propertyId}`);
  } catch (e) {
    console.error("Error updating property status: ", e);
    throw new Error(e.message);
  }
};

