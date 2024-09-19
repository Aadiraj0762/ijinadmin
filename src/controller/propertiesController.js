import { addDoc, collection, deleteDoc, doc as firestoreDoc, getDoc, getDocs, updateDoc } from 'firebase/firestore';
import { getDownloadURL, getStorage, ref, uploadBytes } from 'firebase/storage';
import firestore from '../config-global';

// Collection name
const collectionName = 'journals';

const uploadFiles = async (files, folder = 'journal_covers') => {
  const storage = getStorage();
  const uploadPromises = files.map(async (file) => {
    const storageRef = ref(storage, `${folder}/${file.name}`);
    const snapshot = await uploadBytes(storageRef, file);
    return getDownloadURL(snapshot.ref);
  });
  return Promise.all(uploadPromises);
};

// Create a new journal entry
export const createJournal = async (journalData) => {
  try {
    const completeJournalData = {
      title: journalData.title,
      abbreviation: journalData.abbreviation || '',
      url: journalData.url || '',
      issnPrint: journalData.issnPrint || '',
      issnOnline: journalData.issnOnline || '',
      publisher: journalData.publisher || '',
      discipline: journalData.discipline || '',
      chiefEditor: journalData.chiefEditor || '',
      email: journalData.email || '',
      country: journalData.country || '',
      language: journalData.language || '',
      frequency: journalData.frequency || '',
      yearOfStarting: journalData.yearOfStarting || '',
      articleFormat: journalData.articleFormat || '',
      licenseType: journalData.licenseType || '',
      description: journalData.description || '',
      normalProcessing: journalData.normalProcessing || true,
      fastTrackProcessing: journalData.fastTrackProcessing || false,
    };
    // Handle cover image upload
    if (journalData.coverImage && journalData.coverImage.length > 0) {
      const coverImageUrls = await uploadFiles(journalData.coverImage, 'journal_covers');
      completeJournalData.coverImage = coverImageUrls;
    }

    const docRef = await addDoc(collection(firestore, collectionName), completeJournalData);
    console.log("Document written with ID: ", docRef.id);
    return { id: docRef.id, ...completeJournalData };
  } catch (e) {
    console.error("Error adding document: ", e);
    throw new Error(e.message);
  }
};

export const updateJournal = async (id, updatedData) => {
  try {
    const docRef = firestoreDoc(firestore, collectionName, id);

    // Handle cover image upload
    if (updatedData.coverImage && updatedData.coverImage.length > 0) {
      const coverImageUrls = await uploadFiles(updatedData.coverImage, 'journal_covers');
      updatedData.coverImage = coverImageUrls;
    }

    // other logic...
  } catch (e) {
    console.error("Error updating document: ", e);
    throw new Error(e.message);
  }
};

// Delete a journal entry
export const deleteJournal = async (id) => {
  try {
    const docRef = firestoreDoc(firestore, collectionName, id);
    await deleteDoc(docRef);
    console.log("Document deleted with ID: ", id);
  } catch (e) {
    console.error("Error deleting document: ", e);
    throw e;
  }
};

// Fetch all journal entries
export const getAllJournals = async () => {
  try {
    const querySnapshot = await getDocs(collection(firestore, collectionName));
    const journals = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    return journals;
  } catch (e) {
    console.error("Error getting documents: ", e);
    throw new Error(e.message);
  }
};

// Fetch a journal entry by ID
export const getJournalById = async (id) => {
  try {
    const docRef = firestoreDoc(firestore, collectionName, id);
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


export const updatePropertyFeaturedStatus = async (id, featuredStatus) => {
  try {
    if (typeof id !== 'string') {
      throw new Error('propertyId must be a string');
    }
    if (typeof featuredStatus !== 'boolean') {
      throw new Error('featuredStatus must be a boolean');
    }

    console.log(`Updating property ID: ${id} with featured status: ${featuredStatus}`);

    const docRef = firestoreDoc(firestore, collectionName, id);
    const docSnapshot = await getDoc(docRef);

    if (!docSnapshot.exists()) {
      throw new Error(`No document found with ID: ${id}`);
    }

    await updateDoc(docRef, { featuredStatus });
    console.log(`Featured status updated to ${featuredStatus} for property ID: ${id}`);
  } catch (e) {
    console.error("Error updating featured status: ", e);
    throw new Error(e.message);
  }
};

// Update User status
// Fetch a conference entry by ID
export const updateConferenceStatus = async (UserId, status) => {
  try {
    const docRef = firestoreDoc(firestore, collectionName, UserId);
    await updateDoc(docRef, { UserStatus: status });
    console.log(`User status updated to ${status} for User ID: ${UserId}`);
  } catch (e) {
    console.error("Error updating User status: ", e);
    throw new Error(e.message);
  }
};

export const updateBrowseStatus = async (UserId, browsestatus) => {
  try {
    const docRef = firestoreDoc(firestore, collectionName, UserId);
    await updateDoc(docRef, { BrowseStatus: browsestatus });
    console.log(`User status updated to ${browsestatus} for User ID: ${UserId}`);
  } catch (e) {
    console.error("Error updating User status: ", e);
    throw new Error(e.message);
  }
};