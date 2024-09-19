import { addDoc, collection, deleteDoc, doc as firestoreDoc, getDoc, getDocs, updateDoc } from 'firebase/firestore';
import { getDownloadURL, getStorage, ref, uploadBytes } from 'firebase/storage';
import firestore from '../config-global';

// Collection name
const abstractsCollectionName = 'abstracts';

const uploadAbstractFile = async (file, folder = 'abstract_assets') => {
  const storage = getStorage();
  const storageRef = ref(storage, `${folder}/${file.name}`);
  const snapshot = await uploadBytes(storageRef, file);
  return getDownloadURL(snapshot.ref);
};

// Create a new abstract entry
export const createAbstract = async (abstractData) => {
  try {
    const completeAbstractData = {
      journalName: abstractData.journalName || '',
      issn: abstractData.issn || '',
      publisher: abstractData.publisher || '',
      title: abstractData.title || '',
      affiliation: abstractData.affiliation || '',
      authorName: abstractData.authorName || '',
      abstract: abstractData.abstract || '',
      linkDOI: abstractData.linkDOI || '',
      articleType: abstractData.articleType || ''
    };

    // Handle any file upload (if applicable)
    if (abstractData.assetFile) {
      const assetFileUrl = await uploadAbstractFile(abstractData.assetFile, 'abstract_assets');
      completeAbstractData.assetFile = assetFileUrl;
    }

    const docRef = await addDoc(collection(firestore, abstractsCollectionName), completeAbstractData);
    console.log("Abstract document written with ID: ", docRef.id);
    return { id: docRef.id, ...completeAbstractData };
  } catch (e) {
    console.error("Error adding abstract document: ", e);
    throw new Error(e.message);
  }
};

// Update an abstract entry
export const updateAbstract = async (id, updatedData) => {
  try {
    const docRef = firestoreDoc(firestore, abstractsCollectionName, id);

    // Handle any file upload (if applicable)
    if (updatedData.assetFile) {
      const assetFileUrl = await uploadAbstractFile(updatedData.assetFile, 'abstract_assets');
      updatedData.assetFile = assetFileUrl;
    }

    // Sanitize and filter updated data
    const sanitizedData = {};
    Object.keys(updatedData).forEach(key => {
      const value = updatedData[key];
      if (value !== undefined) {
        const sanitizedKey = key.replace(/[~*/[\]]/g, '_').replace(/\s+/g, '_');
        sanitizedData[sanitizedKey] = value;
      }
    });

    await updateDoc(docRef, sanitizedData);
    console.log("Abstract document updated with ID: ", id);
    return { id, ...sanitizedData };
  } catch (e) {
    console.error("Error updating abstract document: ", e);
    throw new Error(e.message);
  }
};

// Delete an abstract entry
export const deleteAbstract = async (id) => {
  try {
    const docRef = firestoreDoc(firestore, abstractsCollectionName, id);
    await deleteDoc(docRef);
    console.log("Abstract document deleted with ID: ", id);
  } catch (e) {
    console.error("Error deleting abstract document: ", e);
    throw e;
  }
};

// Fetch all abstract entries
export const getAllAbstracts = async () => {
  try {
    const querySnapshot = await getDocs(collection(firestore, abstractsCollectionName));
    const abstracts = querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        journalName: data.journalName || '',
        issn: data.issn || '',
        publisher: data.publisher || '',
        title: data.title || '',
        affiliation: data.affiliation || '',
        authorName: data.authorName || '',
        abstract: data.abstract || '',
        linkDOI: data.linkDOI || '',
        articleType: data.articleType || '',
        assetFile: data.assetFile || null
      };
    });
    return abstracts;
  } catch (e) {
    console.error("Error getting abstract documents: ", e);
    throw new Error(e.message);
  }
};

// Fetch an abstract entry by ID
export const getAbstractById = async (id) => {
  try {
    const docRef = firestoreDoc(firestore, abstractsCollectionName, id);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      console.error(`No such abstract document with ID: ${id}`);
      throw new Error('No such document!');
    }

    const {
      journalName, issn, publisher, title, affiliation, authorName, abstract, linkDOI, articleType, assetFile
    } = docSnap.data();

    return {
      id: docSnap.id,
      journalName: journalName || '',
      issn: issn || '',
      publisher: publisher || '',
      title: title || '',
      affiliation: affiliation || '',
      authorName: authorName || '',
      abstract: abstract || '',
      linkDOI: linkDOI || '',
      articleType: articleType || '',
      assetFile: assetFile || null
    };
  } catch (e) {
    console.error("Error getting abstract document: ", e);
    throw new Error(e.message);
  }
};
