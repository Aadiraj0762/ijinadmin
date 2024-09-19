import { addDoc, arrayUnion, collection, deleteDoc, doc as firestoreDoc, getDoc, getDocs, serverTimestamp, updateDoc } from 'firebase/firestore';
import firestore from '../config-global';

// Collection names
const interestedCollectionName = 'support';
const propertiesCollectionName = 'propert';

// Get all interested properties
export const fetchAllData = async () => {
  try {
    const querySnapshot = await getDocs(collection(firestore, interestedCollectionName));
    const interestedProperties = await Promise.all(querySnapshot.docs.map(async doc => {
      const docData = doc.data();
      const propertyId = docData.property_id;

      if (propertyId) {
        const propertyDocRef = firestoreDoc(firestore, propertiesCollectionName, propertyId);
        const propertyDocSnap = await getDoc(propertyDocRef);
        if (propertyDocSnap.exists()) {
          const propertyData = propertyDocSnap.data();
          const date = docData.submittedDate ? docData.submittedDate.toDate() : null; // Convert Firestore timestamp to Date object
          const formattedDate = date ? `${date.toLocaleDateString()} ${date.toLocaleTimeString()}` : null;
          return { id: doc.id, ...docData, propertyDetails: propertyData,submittedDate: date, formattedDate };
        }
      }

      return { id: doc.id, ...docData };
    }));

    // Fetch categories
    const categoriesSnapshot = await getDocs(collection(firestore, 'categoriesCollectionName'));
    const categories = categoriesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    // Fetch types
    const typesSnapshot = await getDocs(collection(firestore, 'typesCollectionName'));
    const types = typesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    console.log({ interestedProperties, categories, types }); // Log the data

    return { interestedProperties, categories, types };
  } catch (e) {
    console.error("Error getting documents: ", e);
    throw new Error(e.message);
  }
};

export const getTotalInterestedPropertiesCount = async () => {
  try {
    const querySnapshot = await getDocs(collection(firestore, interestedCollectionName));
    const count = querySnapshot.size; // Get the number of documents
    console.log(`Total properties count: ${count}`);
    return count;
  } catch (e) {
    console.error("Error getting total properties count: ", e);
    throw new Error(e.message);
  }
};
// Get interested property by ID
export const getDetailedInterestedPropertyById = async (id) => {
  try {
    const docRef = firestoreDoc(firestore, interestedCollectionName, id);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      console.error(`No such document with ID: ${id}`);
      throw new Error('No such document!');
    }

    const docData = docSnap.data();
    const propertyId = docData.property_id;

    if (propertyId) {
      const propertyDocRef = firestoreDoc(firestore, propertiesCollectionName, propertyId);
      const propertyDocSnap = await getDoc(propertyDocRef);

      if (propertyDocSnap.exists()) {
        const propertyData = propertyDocSnap.data();
        
        return { id: docSnap.id, ...docData, propertyDetails: propertyData };
      }
    }

    return { id: docSnap.id, ...docData };
  } catch (e) {
    console.error("Error getting document: ", e);
    throw new Error(e.message);
  }
};



export const getInterestedPropertyById = async (id) => {
  try {
    const docRef = firestoreDoc(firestore, interestedCollectionName, id);
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
// Add a new interested property
export const addInterestedProperty = async (interestedData) => {
  try {
    const docRef = await addDoc(collection(firestore, interestedCollectionName), {
      ...interestedData,
      createdAt: serverTimestamp()
    });
    console.log("Document written with ID: ", docRef.id);
    return docRef.id;
  } catch (e) {
    console.error("Error adding document: ", e);
    throw new Error(e.message);
  }
};
export const getAllCategories = async () => {
  try {
    const querySnapshot = await getDocs(collection(firestore, 'properties')); // Replace 'properties' with your actual collection name
    const categoriesSet = new Set();

    querySnapshot.docs.forEach(doc => {
      const data = doc.data();
      if (data.propertyCategory) {
        categoriesSet.add(data.propertyCategory);
      }
    });

    const categories = Array.from(categoriesSet).map(category => ({ category }));

    console.log('Fetched categories:', categories); // Add this line for debugging
    return categories;
  } catch (e) {
    console.error("Error getting categories: ", e);
    throw new Error(e.message);
  }
};
export const getAllTypes = async () => {
  try {
    const querySnapshot = await getDocs(collection(firestore, 'properties'));
    
    // Create a Set to track unique types
    const uniqueTypes = new Set();
    const types = [];

    querySnapshot.docs.forEach((doc) => {
      const type = {
        id: doc.id,
        ...doc.data(),
      };
      
      // Only add unique types
      if (!uniqueTypes.has(type.id)) {
        uniqueTypes.add(type.id);
        types.push(type);
      }
    });

    console.log('Fetched Types:', types); // Add this line for debugging
    return types;
  } catch (e) {
    console.error("Error getting types: ", e);
    throw new Error(e.message);
  }
};
// Update interested property
export const updateInterestedProperty = async (id, interestedData) => {
  try {
    const docRef = firestoreDoc(firestore, interestedCollectionName, id);
    await updateDoc(docRef, interestedData);
    console.log("Document updated with ID: ", id);
  } catch (e) {
    console.error("Error updating document: ", e);
    throw new Error(e.message);
  }
};
export const updatePropertyFeaturedStatus = async (propertyId, featuredStatus) => {
  try {
    if (typeof propertyId !== 'string') {
      throw new Error('propertyId must be a string');
    }
    if (typeof featuredStatus !== 'boolean') {
      throw new Error('featuredStatus must be a boolean');
    }

    console.log(`Updating property ID: ${propertyId} with featured status: ${featuredStatus}`);

    const docRef = firestoreDoc(firestore, 'properties', propertyId);
    await updateDoc(docRef, { featuredStatus });
    console.log(`Featured status updated to ${featuredStatus} for property ID: ${propertyId}`);
  } catch (e) {
    console.error("Error updating featured status: ", e);
    throw new Error(e.message);
  }
};

// Update property status with comments
// Update property status with comments
export const updatePropertyStatusWithComments = async (propertyId, status, comment, dateTimeArray) => {
  try {
    // Reference to the specific document in the 'interested' collection
    const docRef = firestoreDoc(firestore, 'support', propertyId);

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
// export const updatePropertyStatusWithComments = async (propertyId, status, comment) => {
//   try {
//     // Reference to the specific document in the 'interested' collection
//     const docRef = doc(firestore, 'interested', propertyId);

//     // Fetch the current document data
//     const docSnap = await getDoc(docRef);
//     const currentData = docSnap.data() || {};

//     // Ensure status and comment are arrays
//     const statusArray = currentData.status || [];
//     const commentArray = currentData.comment || [];

//     // Add new status to array if it doesn't already exist
//     if (status && !statusArray.includes(status)) {
//       statusArray.push(status);
//     }

//     // Add new comment to array if it doesn't already exist
//     if (comment && !commentArray.includes(comment)) {
//       commentArray.push(comment);
//     }

//     // Prepare update data
//     const updateData = {
//       status: statusArray,
//       comment: commentArray,
//       updatedAt: serverTimestamp()
//     };

//     // Update the document in Firestore
//     await updateDoc(docRef, updateData);

//     console.log(`Property status updated to ${status} with comments for property ID: ${propertyId}`);
//   } catch (e) {
//     console.error("Error updating property status: ", e);
//     throw new Error(e.message);
//   }
// };

// Delete an interested property
export const deleteInterestedProperty = async (id) => {
  try {
    const docRef = firestoreDoc(firestore, interestedCollectionName, id);
    await deleteDoc(docRef);
    console.log("Document deleted with ID: ", id);
  } catch (e) {
    console.error("Error deleting document: ", e);
    throw new Error(e.message);
  }
};
