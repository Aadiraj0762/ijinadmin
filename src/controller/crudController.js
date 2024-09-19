import { addDoc, collection, deleteDoc, doc as firestoreDoc, getDoc, getDocs, updateDoc } from 'firebase/firestore';
import { getDownloadURL, getStorage, ref, uploadBytes } from 'firebase/storage';
import firestore from '../config-global';

// Collection names
const articleCollectionName = 'articles';
const authorCollectionName = 'authors';
const directoryCollectionName = 'directories';

// Add Author
export const addAuthor = async (author) => {
  try {
    const authorRef = await addDoc(collection(firestore, authorCollectionName), author);
    console.log("Author added with ID: ", authorRef.id);
    return { id: authorRef.id, ...author };
  } catch (error) {
    console.error('Error adding author: ', error);
    throw error;
  }
};

// Get Authors
export const getAuthors = async () => {
  try {
    const querySnapshot = await getDocs(collection(firestore, authorCollectionName));
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Error getting authors: ', error);
    throw error;
  }
};

// Add Article
export const addArticle = async (article) => {
  try {
    const storage = getStorage();
    const storageRef = ref(storage, 'articles');
    // Handle file upload for article
    const fileRef = ref(storageRef, article.file.name);
    await uploadBytes(fileRef, article.file);
    const fileUrl = await getDownloadURL(fileRef);
    
    const articleData = {
      title: article.title,
      abstract: article.abstract,
      fileUrl, // Store URL of the uploaded file
      authorId: article.authorId,
      // other relevant data
    };

    const articleRef = await addDoc(collection(firestore, articleCollectionName), articleData);
    console.log("Article added with ID: ", articleRef.id);
    return { id: articleRef.id, ...articleData };
  } catch (error) {
    console.error('Error adding article: ', error);
    throw error;
  }
};

// Get Articles
export const getArticles = async () => {
  try {
    const querySnapshot = await getDocs(collection(firestore, articleCollectionName));
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Error getting articles: ', error);
    throw error;
  }
};

// Get Article by ID
export const getArticleByID = async (id) => {
  try {
    const articleRef = firestoreDoc(firestore, articleCollectionName, id);
    const articleDoc = await getDoc(articleRef);

    if (articleDoc.exists()) {
      return { id: articleDoc.id, ...articleDoc.data() };
    }

    console.log(`No article found with ID ${id}`);
    return null;
  } catch (error) {
    console.error('Error getting article:', error);
    throw error;
  }
};

// Update Article
export const updateArticle = async (id, updatedData) => {
  const storage = getStorage();
  try {
    const dataToUpdate = { ...updatedData };

    if (dataToUpdate.file) {
      const file = dataToUpdate.file;
      const storageRef = ref(storage, `articles/${id}/${file.name}`);
      
      const snapshot = await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(snapshot.ref);
      
      dataToUpdate.fileUrl = downloadURL;
      delete dataToUpdate.file;
    }

    console.log('Data to update before sending to Firestore:', dataToUpdate);

    const docRef = firestoreDoc(firestore, articleCollectionName, id);
    await updateDoc(docRef, dataToUpdate);

    console.log("Document updated with ID: ", id);
    return { id, ...dataToUpdate };

  } catch (error) {
    console.error('Error updating article: ', error);
    throw new Error(error.message);
  }
};

// Delete Article
export const deleteArticle = async (id) => {
  try {
    const articleRef = firestoreDoc(firestore, articleCollectionName, id);
    await deleteDoc(articleRef);
  } catch (error) {
    console.error('Error deleting article: ', error);
    throw error;
  }
};

// Add Directory
export const addDirectory = async (directory) => {
  try {
    const directoryRef = await addDoc(collection(firestore, directoryCollectionName), directory);
    console.log("Directory added with ID: ", directoryRef.id);
    return { id: directoryRef.id, ...directory };
  } catch (error) {
    console.error('Error adding directory: ', error);
    throw error;
  }
};

// Get Directories
export const getDirectories = async () => {
  try {
    const querySnapshot = await getDocs(collection(firestore, directoryCollectionName));
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Error getting directories: ', error);
    throw error;
  }
};

// Get Directory by ID
export const getDirectoryByID = async (id) => {
  try {
    const directoryRef = firestoreDoc(firestore, directoryCollectionName, id);
    const directoryDoc = await getDoc(directoryRef);

    if (directoryDoc.exists()) {
      return { id: directoryDoc.id, ...directoryDoc.data() };
    }

    console.log(`No directory found with ID ${id}`);
    return null;
  } catch (error) {
    console.error('Error getting directory:', error);
    throw error;
  }
};

// Update Directory
export const updateDirectory = async (id, updatedData) => {
  try {
    const docRef = firestoreDoc(firestore, directoryCollectionName, id);
    await updateDoc(docRef, updatedData);
    console.log("Directory updated with ID: ", id);
    return { id, ...updatedData };
  } catch (error) {
    console.error('Error updating directory: ', error);
    throw error;
  }
};

// Delete Directory
export const deleteDirectory = async (id) => {
  try {
    const directoryRef = firestoreDoc(firestore, directoryCollectionName, id);
    await deleteDoc(directoryRef);
  } catch (error) {
    console.error('Error deleting directory: ', error);
    throw error;
  }
};
