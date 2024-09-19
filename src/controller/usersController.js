import { createUserWithEmailAndPassword, getAuth } from 'firebase/auth';
import { collection, deleteDoc, doc as firestoreDoc, getDocs, serverTimestamp, setDoc, updateDoc } from 'firebase/firestore';
import firestore from '../config-global';

// Collection name
const collectionName = 'users';

// Initialize Firebase Authentication
const auth = getAuth();


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
      type: data.type,
      zipCode: data.zipCode,
      avatarUrl: data.avatarUrl,
      isVerified: data.isVerified,
      status: data.status || 'active',
      uid: user.uid, // Store the user's UID
      createdAt: serverTimestamp() // Firestore server timestamp
    };

    // Use setDoc with the user's UID as the document ID
    const docRef = await setDoc(firestoreDoc(firestore, collectionName, user.uid), userData);
    console.log("Document written with ID: ", user.uid);
    return user.uid;
  } catch (e) {
    console.error("Error adding document: ", e);
    throw e;
  }
};

export const getUsers = async () => {
  try {
    const querySnapshot = await getDocs(collection(firestore, collectionName));
    return querySnapshot.docs.map(doc => {
      const docData = doc.data();
      const date = docData.createdAt ? docData.createdAt.toDate() : null; // Convert Firestore timestamp to Date object
      const formattedDate = date ? `${date.toLocaleDateString()} ${date.toLocaleTimeString()}` : "N/A"; // Format date including time
      return { id: doc.id, ...docData, createdAt: date, formattedDate };
    });
  } catch (e) {
    console.error("Error getting documents: ", e);
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

export const getTotalUsersCount = async () => {
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
// Update
export const updateUser = async (id, data) => {
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
// Update User status
export const updateUserStatus = async (UserId, status) => {
  try {
    const docRef = firestoreDoc(firestore, collectionName, UserId);
    await updateDoc(docRef, { UserStatus: status });
    console.log(`User status updated to ${status} for User ID: ${UserId}`);
  } catch (e) {
    console.error("Error updating User status: ", e);
    throw new Error(e.message);
  }
};
// Delete
export const deleteUser = async (id) => {
  try {
    const docRef = firestoreDoc(firestore, collectionName, id);
    await deleteDoc(docRef);
    console.log(`Document with ID ${id} successfully deleted.`);
  } catch (e) {
    console.error("Error deleting document: ", e);
    throw e;
  }
};
