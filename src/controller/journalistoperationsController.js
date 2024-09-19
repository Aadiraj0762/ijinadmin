import { createUserWithEmailAndPassword, getAuth } from 'firebase/auth';
import { collection, deleteDoc, doc as firestoreDoc, getDocs, serverTimestamp, setDoc, updateDoc } from 'firebase/firestore';
import firestore from '../config-global';

const collectionName = 'operations';
const auth = getAuth(); // Initialize Firebase Authentication

export const addOperations = async (data) => {
  try {
    const operationsCredential = await createUserWithEmailAndPassword(auth, data.email, data.password);
    const operationsUid = operationsCredential.user.uid;

    const operationsRef = firestoreDoc(firestore, collectionName, operationsUid);
    const operationsData = {
      name: data.name,
      email: data.email,
      phoneNumber: data.phoneNumber,
      address: data.address,
      country: data.country,
      state: data.state,
      city: data.city,
      type: data.type,
      zipCode: data.zipCode,
      avatarUrl: data.avatarUrl,
      isVerified: data.isVerified,
      status: data.status || 'active',
      uid: operationsUid,
      createdAt: serverTimestamp()
    };

    await setDoc(operationsRef, operationsData);
    console.log("Document written with ID: ", operationsUid);
    return operationsUid;
  } catch (e) {
    console.error("Error adding document: ", e);
    throw e;
  }
};

export const getOperations = async () => {
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

export const getOperationsByID = async (id) => {
  try {
    const querySnapshot = await getDocs(collection(firestore, collectionName));
    const users = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    const foundUser = users.find(u => u.id === id); // Renamed variable to 'foundUser'
    if (!foundUser) {
      throw new Error('Operations not found');
    }
    return foundUser;
  } catch (e) {
    console.error("Error getting Operations: ", e);
    throw e;
  }
};
export const updateOperations = async (id, data) => {
  try {
    const docRef = firestoreDoc(firestore, collectionName, id);
    await updateDoc(docRef, data);
    console.log(`Document with ID ${id} successfully updated.`);
  } catch (e) {
    console.error("Error updating document: ", e);
    throw e;
  }
};
export const getTotalCustomersCount = async () => {
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
export const updateOperationsStatus = async (operationsId, status) => {
  try {
    const docRef = firestoreDoc(firestore, collectionName, operationsId);
    await updateDoc(docRef, { status });
    console.log(`Operations status updated to ${status} for Operations ID: ${operationsId}`);
  } catch (e) {
    console.error("Error updating Operations status: ", e);
    throw e;
  }
};

export const deleteOperations = async (id) => {
  try {
    const docRef = firestoreDoc(firestore, collectionName, id);
    await deleteDoc(docRef);
    console.log(`Document with ID ${id} successfully deleted.`);
  } catch (e) {
    console.error("Error deleting document: ", e);
    throw e;
  }
};
