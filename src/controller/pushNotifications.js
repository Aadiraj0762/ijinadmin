import { addDoc, collection, deleteDoc, doc as firestoreDoc, getDoc, getDocs, updateDoc } from 'firebase/firestore';
import firestore from '../config-global';

// Collection name for notifications
const collectionName = 'notifications';

// Initialize Firebase Messaging
// Create a new notification and send push notification
const generateRandomToken = () => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let token = '';

  // Generate a random 20-character token
  for (let i = 0; i < 20; i += 1) { // Using += 1 instead of ++
    token += characters.charAt(Math.floor(Math.random() * characters.length));
  }

  return token;
};

export const createNotification = async (notificationData) => {
  try {
    const { token, message, ...data } = notificationData;
    const completeNotificationData = {
      ...data,
      token: token || generateRandomToken(), // Use provided token or generate a random one
      message,
      createdAt: new Date().toISOString(),
    };    
    
    const docRef = await addDoc(collection(firestore, collectionName), completeNotificationData);
    console.log("Notification written with ID: ", docRef.id);

    return { id: docRef.id, ...completeNotificationData };
  } catch (e) {
    console.error("Error adding notification: ", e);
    throw new Error(e.message);
  }
};


// Get all notifications
export const getAllNotifications = async () => {
  try {
    const querySnapshot = await getDocs(collection(firestore, collectionName));
    const notifications = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));
    return notifications;
  } catch (e) {
    console.error("Error getting notifications: ", e);
    throw new Error(e.message);
  }
};

// Get notification by ID
export const getNotificationById = async (id) => {
  try {
    const docRef = firestoreDoc(firestore, collectionName, id);
    const docSnap = await getDoc(docRef);
    
    if (!docSnap.exists()) {
      console.error(`No such notification with ID: ${id}`);
      throw new Error('No such notification!');
    }
    
    return { id: docSnap.id, ...docSnap.data() };
  } catch (e) {
    console.error("Error getting notification: ", e);
    throw new Error(e.message);
  }
};

// Update a notification
export const updateNotification = async (id, updatedData) => {
  try {
    const docRef = firestoreDoc(firestore, collectionName, id);
    await updateDoc(docRef, updatedData);
    console.log("Notification updated with ID: ", id);
    return { id, ...updatedData };
  } catch (e) {
    console.error("Error updating notification: ", e);
    throw new Error(e.message);
  }
};

// Delete a notification
export const deleteNotification = async (id) => {
  try {
    const docRef = firestoreDoc(firestore, collectionName, id);
    await deleteDoc(docRef);
    console.log("Notification deleted with ID: ", id);
  } catch (e) {
    console.error("Error deleting notification: ", e);
    throw e;
  }
};
