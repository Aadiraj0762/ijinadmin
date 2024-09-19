import { createUserWithEmailAndPassword, getAuth } from 'firebase/auth';
import { addDoc, collection, deleteDoc, doc as firestoreDoc, getDocs, updateDoc } from 'firebase/firestore';
import firestore from '../config-global';

// Collection name
const collectionName = 'admin';

// Initialize Firebase Authentication
const auth = getAuth();

// Create
export const addUser = async (data) => {
  try {
    // Create user with email and password
    const userCredential = await createUserWithEmailAndPassword(auth, data.email, data.password);
    const user = userCredential.user;

    // Add additional user data to Firestore
    const userData = {
      name: data.name,
      email: data.email,
      phoneNumber: data.phoneNumber,
      address: data.address,
      country: data.country,
      state: data.state,
      city: data.city,
      zipCode: data.zipCode,
      avatarUrl: data.avatarUrl,
      about: data.about,
      
      uid: user.uid // Store the user's UID
    };

    const docRef = await addDoc(collection(firestore, collectionName), userData);
    console.log("Document written with ID: ", docRef.id);
    return docRef.id;
  } catch (e) {
    console.error("Error adding document: ", e);
    throw e;
  }
};

// Read
export const getUsers = async () => {
  try {
    const querySnapshot = await getDocs(collection(firestore, collectionName));
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (e) {
    console.error("Error getting documents: ", e);
    throw e;
  }
};

// Update
export const updateUser = async (id, data) => {
    try {
      // Validate data
      if (!id || !data) {
        throw new Error("Invalid ID or data");
      }
  
      const docRef = firestoreDoc(firestore, collectionName, id);
      
      // Use merge option to update only specified fields
      await updateDoc(docRef, data, { merge: true });
      console.log(`Document with ID ${id} successfully updated.`);
    } catch (e) {
      console.error("Error updating document: ", e);
      throw e;
    }
  };

// Delete
export const deleteUser = async (id) => {
  try {
    const docRef = firestoreDoc(firestore, collectionName, id);
    await deleteDoc(docRef);
  } catch (e) {
    console.error("Error deleting document: ", e);
    throw e;
  }
};
export const getUsersByID = async (id) => {
  try {
    const querySnapshot = await getDocs(collection(firestore, collectionName));
    const users = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    const foundUser = users.find(u => u.id === id); // Renamed variable to 'foundUser'
    if (!foundUser) {
      throw new Error('User not found');
    }
    return foundUser;
  } catch (e) {
    console.error("Error getting user: ", e);
    throw e;
  }
};